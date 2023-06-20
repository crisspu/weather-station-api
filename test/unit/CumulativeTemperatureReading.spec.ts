import { expect } from "chai";
import { describe, it } from 'mocha';
import { CumulativeTemperatureReading, Temperature } from "../../src/domain/value-objects";
import { TemperatureReading } from "../../src/domain/entities";

describe('CumulativeTemperatureReading', () => {

    it('should be undefined if there are no readings', () => {
        const cumulations = CumulativeTemperatureReading.create([]);
        expect(cumulations).to.be.undefined;
    });

    it('should return the cumulative values', () => {
        const readings = [
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(100)!, "1"),
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(180)!, "1"),
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(210)!, "1"),
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(322)!, "1"),
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(381)!, "1"),
        ];
        const cumulations = CumulativeTemperatureReading.create(readings);
        expect(cumulations).not.to.be.undefined;
        expect(cumulations?.min.kelvin).to.equal(100);
        expect(cumulations?.max.kelvin).to.equal(381);
        expect(cumulations?.average.kelvin).to.equal(239);
        expect(cumulations?.median.kelvin).to.equal(210);
    });

});
