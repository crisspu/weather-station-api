import { expect } from "chai";
import { describe, it } from 'mocha';
import { getUserName } from "../../src/api/authorization";

describe('getUserName', () => {

    it('should be undefined if authorization is empty', () => {
        const userName = getUserName(undefined);
        expect(userName).to.be.undefined;
    });

    it('should be undefined if the authorization is unsupported', () => {
        const userName = getUserName("Bearer TOKEN");
        expect(userName).to.be.undefined;
    });

    it('should return the user name for properly encoded Basic authentication', () => {
        const userName = getUserName("Basic dXNlcjAwMTo=");
        expect(userName).not.to.be.undefined;
        expect(userName).to.equal("user001");
    });
});
