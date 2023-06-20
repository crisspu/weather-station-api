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
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(200)!, "1"),
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(300)!, "1"),
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(400)!, "1"),
            TemperatureReading.create("1", new Date(), new Date(), Temperature.create(500)!, "1")
        ];
        const cumulations = CumulativeTemperatureReading.create(readings);
        expect(cumulations).not.to.be.undefined;
        expect(cumulations?.min.kelvin).to.equal(100);
        expect(cumulations?.max.kelvin).to.equal(500);
        expect(cumulations?.average.kelvin).to.equal(300);
    });

});
