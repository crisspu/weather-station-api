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
    readonly median: Temperature;

    private constructor(readings: TemperatureReading[]) {
        const kelvins = readings.map(r => r.temperature.kelvin);
        this.min = Temperature.create(this.getMin(kelvins))!;
        this.max = Temperature.create(this.getMax(kelvins))!;
        this.average = Temperature.create(this.getAverage(kelvins))!;
        this.median = Temperature.create(this.getMedian(kelvins))!;
    }

    public static create(readings: TemperatureReading[]): CumulativeTemperatureReading | undefined {
        if (readings.length < 1)
            return undefined;
        return new CumulativeTemperatureReading(readings);
    }

    private getMin(numbers: number[]): number {
        return Math.min(...numbers);
    }

    private getMax(numbers: number[]): number {
        return Math.max(...numbers);
    }

    private getAverage(numbers: number[]): number {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    private getMedian(numbers: number[]): number {
        const sortedNumbers = numbers.sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedNumbers.length / 2);
      
        if (sortedNumbers.length % 2 === 0) {
          return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
        } else {
          return sortedNumbers[middleIndex];
        }
    }
      
};
