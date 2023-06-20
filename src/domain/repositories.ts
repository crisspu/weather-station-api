import { TemperatureReading } from "./entities";

export interface TemperatureReadingsRepository {
    getById(id: string): Promise<TemperatureReading | undefined>;
    getForStation(stationId: string, from?: Date, to?: Date): Promise<TemperatureReading[]>;
    getLastTimeStampForStation(stationId: string): Promise<Date>;
    save(reading: TemperatureReading): Promise<void>;
    delete(reading: TemperatureReading): Promise<void>;
    getNextId(): Promise<string>;
};
