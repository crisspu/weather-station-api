import { Request, Response, NextFunction } from 'express';
import { getRepository } from "../infrastructure/repositories";

export const authorizeForStation = async (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers;
    const { stationId } = request.params;
    if (!await isAuthorizedForStation(getUserName(authorization), stationId))
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

async function isAuthorizedForStation(userName: string | undefined, stationId: string): Promise<boolean> {
    if (!userName)
        return false;

    const repo = await getRepository();
    const user = repo.user.getByUserName(userName);
    if (!user)
        return false;

    return (user.isAdmin || user.station === stationId);
};
