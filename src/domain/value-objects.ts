import { TemperatureReading } from "./entities";

export class Temperature {
    readonly kelvin: number;
    readonly celsius: number;
    readonly fahrenheit: number;

    private constructor(kelvins: number) {
        this.kelvin = Math.round(kelvins);
        this.celsius = Math.round(kelvins - 273.15);
        this.fahrenheit = Math.round((kelvins * 9 / 5) - 459.67);
    }

    public static create(kelvin: number): Temperature | undefined {
        if (kelvin < 0) {
            return;
        }

        return new Temperature(kelvin);
    }
}

export class CumulativeTemperatureReading {
    readonly min: Temperature;
    readonly max: Temperature;
    readonly average: Temperature;

    private constructor(readings: TemperatureReading[]) {
        const kelvins = readings.map(r => r.temperature.kelvin);
        this.min = Temperature.create(Math.min(...kelvins))!;
        this.max = Temperature.create(Math.max(...kelvins))!;
        this.average = Temperature.create(kelvins.reduce((a, b) => a + b, 0) / kelvins.length)!;
    }

    public static create(readings: TemperatureReading[]): CumulativeTemperatureReading | undefined {
        if (readings.length < 1)
            return undefined;
        return new CumulativeTemperatureReading(readings);
    }
};
