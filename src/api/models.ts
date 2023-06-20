import { Station, TemperatureReading } from '../domain/entities';
import { CumulativeTemperatureReading, Temperature } from '../domain/value-objects';

export class TemperatureModel {
    kelvin: number;
    celsius: number;
    fahrenheit: number;

    constructor(temperature: Temperature) {
        this.kelvin = temperature.kelvin;
        this.celsius = temperature.celsius;
        this.fahrenheit = temperature.fahrenheit;
    }
};

export class StationModel {
    id: string;
    name: string;

    constructor(station: Station) {
        this.id = station.id;
        this.name = station.name;
    }
};

export class TemperatureReadingModel {
    id: string;
    date: string;
    temperature: TemperatureModel;

    constructor(temperatureReading: TemperatureReading) {
        this.id = temperatureReading.id;
        this.date = temperatureReading.date.toISOString();
        this.temperature = new TemperatureModel(temperatureReading.temperature);
    }
};

export class CumulativeTemperatureReadingModel {
    min: TemperatureModel;
    max: TemperatureModel;
    average: TemperatureModel;

    constructor(cumulatives: CumulativeTemperatureReading) {
        this.min = new TemperatureModel(cumulatives.min);
        this.max = new TemperatureModel(cumulatives.max);
        this.average = new TemperatureModel(cumulatives.average);
    }
}

export interface TemperatureReadingToAddModel {
    date: string;
    temperatureInKelvin: number;
};

export interface TemperatureReadingToUpdateModel {
    date: string;
    temperatureInKelvin: number;
};
