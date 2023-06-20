import { Request, Response, NextFunction } from 'express';
import { userRepository } from "../infrastructure/repositories";

export const authorizeForStation = async (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers;
    const { stationId } = request.params;
    if (!isAuthorizedForStation(getUserName(authorization), stationId))
        return response.status(401).send({ error: `User not authorized.` });

    next();
};

export function getUserName(authorization: string | undefined): string | undefined {
    if (!authorization)
        return;

    // Basic authorization
    if (authorization.startsWith("Basic")) {
        const userEncoded = authorization.substring(6);
        const user = atob(userEncoded);
        const userName = user.split(":")[0];
        return userName;
    }

    // Here should go other types of authorization...

    return;
};

function isAuthorizedForStation(userName: string | undefined, stationId: string): boolean {
    if (!userName)
        return false;

    const user = userRepository.getByUserName(userName);
    if (!user)
        return false;

    return (user.isAdmin || user.station === stationId);
};
