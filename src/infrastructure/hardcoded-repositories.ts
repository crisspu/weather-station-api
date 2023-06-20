import { stations, users, temperatureReadings } from "./data";
import { Station, TemperatureReading, User } from "../domain/entities";
import { TemperatureReadingsRepository } from "../domain/repositories";

export class HardcodedUserRepository {
    getByUserName(userName: string): User | undefined {
        const lowerCaseUserName = userName.toLowerCase();
        return users.filter(u => u.userName.toLowerCase() === lowerCaseUserName)[0];
    }
};

export class HardcodedStationRepository {
    getAll(): Station[] {
        return stations;
    }

    getById(id: string): Station | undefined {
        return stations.filter(s => s.id === id)[0];
    }
};

export class InMemoryTemperatureReadingsRepository implements TemperatureReadingsRepository {
    async getById(id: string): Promise<TemperatureReading | undefined> {
        return temperatureReadings[this.indexOf(id)];
    }

    async getForStation(stationId: string, from: Date = new Date(0), to: Date = new Date(8640000000000000)): Promise<TemperatureReading[]> {
        return temperatureReadings
            .filter(r => r.stationId === stationId && r.date >= from && r.date <= to);
    }

    async getLastTimeStampForStation(stationId: string): Promise<Date> {
        return temperatureReadings
            .filter(r => r.stationId === stationId)
            .map(r => r.timeStamp)
            .reduce((a, b) => a > b ? a : b, new Date(0));
    }

    async save(reading: TemperatureReading): Promise<void> {
        const index = this.indexOf(reading.id);
        if (index >= 0) {
            temperatureReadings[index] = reading;
        } else {
            temperatureReadings.push(reading);
        }
    }

    async delete(reading: TemperatureReading): Promise<void> {
        const index = this.indexOf(reading.id);
        if (index >= 0)
            temperatureReadings.splice(index, 1);
    }

    private indexOf(id: string): number {
        return temperatureReadings.map(r => r.id).indexOf(id);
    }

    async getNextId(): Promise<string> {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
};
