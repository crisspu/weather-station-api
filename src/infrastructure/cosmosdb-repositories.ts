import { Container, CosmosClient } from "@azure/cosmos";
import { Temperature } from "../domain/value-objects";
import { TemperatureReading } from "../domain/entities";
import { TemperatureReadingsRepository } from "../domain/repositories";

const databaseName = "weather-station-api";
const containerName = "temperature-readings";
const partitionKeyPath = [ "/id" ];

export class CosmosDBTemperatureReadingsRepository implements TemperatureReadingsRepository {

    private _container: Container | undefined;

    private constructor() { }

    public static async create(endpoint: string, key: string): Promise<CosmosDBTemperatureReadingsRepository> {
        const me = new CosmosDBTemperatureReadingsRepository();
        me._container = await me.getContainer(endpoint, key);
        return me;
      };

    private async getContainer(endpoint: string, key: string): Promise<Container> {
        const cosmosClient = new CosmosClient({ endpoint, key });

        // Create database if it doesn't exist
        const { database } = await cosmosClient.databases.createIfNotExists({
            id: databaseName
        });
        console.log(`${database.id} database ready`);

        // Create container if it doesn't exist
        const { container } = await database.containers.createIfNotExists({
            id: containerName,
            partitionKey: {
                paths: partitionKeyPath
            }
        });
        console.log(`${container.id} container ready`);

        return container;
    }

    async getById(id: string): Promise<TemperatureReading | undefined> {
        const { resource } = await this._container!.item(id, id).read();
        return resource ? TemperatureReading.create(resource.id,
            new Date(resource.timeStamp), new Date(resource.date),
            Temperature.create(resource.temperature)!, resource.stationId) : undefined;
    }

    async getForStation(stationId: string, from: Date = new Date(0), to: Date = new Date(8640000000000000)): Promise<TemperatureReading[]> {
        const querySpec = {
            // query: "SELECT * FROM c WHERE c.stationId = @stationId",
            query: "SELECT * FROM c WHERE c.stationId = @stationId AND c.dateNumeric >= @from AND c.dateNumeric <= @to",
            parameters: [
                { name: "@stationId", value: stationId },
                { name: "@from", value: from.getTime() },
                { name: "@to", value: to.getTime() }
            ]
        };
        const { resources } = await this._container!.items.query(querySpec).fetchAll();

        return resources.map(r => TemperatureReading.create(r.id,
            new Date(r.timeStamp), new Date(r.date),
            Temperature.create(r.temperature)!, r.stationId));
    }

    async getLastTimeStampForStation(stationId: string): Promise<Date> {
        const querySpec = {
            query: "SELECT * FROM c WHERE c.stationId = @stationId",
            parameters: [ { name: "@stationId", value: stationId } ]
        };
        const { resources } = await this._container!.items.query(querySpec).fetchAll();

        return resources
            .map(r => new Date(r.timeStamp))
            .reduce((a, b) => a > b ? a : b, new Date(0));
    }

    async save(reading: TemperatureReading): Promise<void> {
        await this._container!.items.upsert({
            id: reading.id,
            stationId: reading.stationId,
            date: reading.date,
            dateNumeric: reading.date.getTime(),
            timeStamp: reading.timeStamp,
            temperature: reading.temperature.kelvin
        });
    }

    async delete(reading: TemperatureReading): Promise<void> {
        await this._container!.item(reading.id, reading.id).delete();
    }

    async getNextId(): Promise<string> {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
};
