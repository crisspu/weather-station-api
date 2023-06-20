import { expect } from "chai";
import { describe, it } from 'mocha';
import { getDate, getDateOnly } from "../../src/api/controllers";

describe('getDate', () => {

    it('should be undefined if the input string is undefined', () => {
        const date = getDate(undefined);
        expect(date).to.be.undefined;
    });

    it('should have only the date portion when time is not provided', () => {
        const date = getDate("2023-11-13");
        expect(date).not.to.be.undefined;
        expect(date?.toISOString()).to.equal("2023-11-13T00:00:00.000Z");
    });

    it('should match the input string', () => {
        const date = getDate("2023-11-13T22:11:00.999Z");
        expect(date).not.to.be.undefined;
        expect(date?.toISOString()).to.equal("2023-11-13T22:11:00.999Z");
    });

});

describe('getDateOnly', () => {

    it('should have only the date portion when the time portion is not provided', () => {
        const date = getDateOnly(new Date("2023-11-13"));
        expect(date).not.to.be.undefined;
        expect(date.toISOString()).to.equal("2023-11-13T00:00:00.000Z");
    });

    it('should have only the date portion even when the time portion is provided', () => {
        const date = getDateOnly(new Date("2023-11-13T22:11:00.999Z"));
        expect(date).not.to.be.undefined;
        expect(date?.toISOString()).to.equal("2023-11-13T00:00:00.000Z");
    });

});
