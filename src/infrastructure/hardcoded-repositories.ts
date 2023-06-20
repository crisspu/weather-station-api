import { stations, users, temperatureReadings } from "./data";
import { Station, TemperatureReading, User } from "../domain/entities";

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

export class InMemoryTemperatureReadingsRepository {
    getById(id: string): TemperatureReading | undefined {
        return temperatureReadings[this.indexOf(id)];
    }

    getForStation(stationId: string, from: Date = new Date(0), to: Date = new Date(8640000000000000)): TemperatureReading[] {
        return temperatureReadings
            .filter(r => r.stationId === stationId && r.date >= from && r.date <= to);
    }

    getLastTimeStampForStation(stationId: string): Date {
        return temperatureReadings
            .filter(r => r.stationId === stationId)
            .map(r => r.timeStamp)
            .reduce((a, b) => a > b ? a : b, new Date(0));
    }

    save(reading: TemperatureReading) {
        const index = this.indexOf(reading.id);
        if (index >= 0) {
            temperatureReadings[index] = reading;
        } else {
            temperatureReadings.push(reading);
        }
    }

    delete(reading: TemperatureReading) {
        const index = this.indexOf(reading.id);
        if (index >= 0)
            temperatureReadings.splice(index, 1);
    }

    private indexOf(id: string): number {
        return temperatureReadings.map(r => r.id).indexOf(id);
    }

    getNextId(): string {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
};
