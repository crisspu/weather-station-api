import { expect } from "chai";
import { describe, it } from 'mocha';
import { Temperature } from "../../src/domain/value-objects";

describe('Temperature', () => {

    it('should be undefined if the value is negative', () => {
        const temperature = Temperature.create(-5);
        expect(temperature).to.be.undefined;
    });

    it('should round non-integer values (up)', () => {
        const temperature = Temperature.create(300.555);
        expect(temperature).not.to.be.undefined;
        expect(temperature?.kelvin).to.equal(301);
    });

    it('should round non-integer values (down)', () => {
        const temperature = Temperature.create(300.444);
        expect(temperature).not.to.be.undefined;
        expect(temperature?.kelvin).to.equal(300);
    });

    it('should convert the values', () => {
        const temperature = Temperature.create(300);
        expect(temperature).not.to.be.undefined;
        expect(temperature?.kelvin).to.equal(300);
        expect(temperature?.celsius).to.equal(27);
        expect(temperature?.fahrenheit).to.equal(80);
    });

});
