import { Temperature } from "./value-objects";

export interface User {
    userName: string;
    name: string;
    station?: string;
    isAdmin?: boolean;
};

export interface Station {
    id: string;
    name: string;
};

export class TemperatureReading {
    readonly id: string;
    readonly timeStamp: Date;
    private _date: Date;
    private _temperature: Temperature;
    readonly stationId: string;

    private constructor(id: string, timeStamp: Date, date: Date, temperature: Temperature, stationId: string) {
        this.id = id;
        this.timeStamp = timeStamp;
        this._date = date;
        this._temperature = temperature;
        this.stationId = stationId;
    }

    public static create(id: string, timeStamp: Date, date: Date, temperature: Temperature, stationId: string): TemperatureReading {
        return new TemperatureReading(id, timeStamp, date, temperature, stationId);
    }

    get temperature() {
        return this._temperature;
    }

    set temperature(temperature: Temperature) {
        this._temperature = temperature;
    }

    get date() {
        return this._date;
    }

    set date(date: Date) {
        this._date = date;
    }
};
