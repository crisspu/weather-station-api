import { settings } from "../settings";
import { TemperatureReadingsRepository } from "../domain/repositories";
import { CosmosDBTemperatureReadingsRepository } from "./cosmosdb-repositories";
import { HardcodedStationRepository, HardcodedUserRepository } from "./hardcoded-repositories";

class Repository {
    private _user = new HardcodedUserRepository();
    private _station = new HardcodedStationRepository();
    private _temperatureReading: TemperatureReadingsRepository | undefined;

    private constructor() {
    }

    public static async create() {
        const { endpoint, key } = settings.database;
        const me = new Repository();
        me._temperatureReading = await CosmosDBTemperatureReadingsRepository.create(endpoint, key);
        return me;
    }

    get user() {
        return this._user;
    }

    get station() {
        return this._station;
    }

    get temperatureReadings(): TemperatureReadingsRepository {
        return this._temperatureReading!;
    }
}

let _repository: Repository | undefined;
export async function getRepository() {
    if (!_repository)
      _repository = await Repository.create();
    return _repository;
};
