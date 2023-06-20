import { User, Station, TemperatureReading } from "../domain/entities";

export const users: User[] = [
    { userName: "admin", name: "Admnistrator", isAdmin: true },
    { userName: "kzuzelj", name: "Kristijan Zuzelj", station: "00001" },
    { userName: "user001", name: "User 001", station: "00001" },
    { userName: "user002", name: "User 002", station: "00002" },
    { userName: "user003", name: "User 003", station: "00003" },
    { userName: "user004", name: "User 003", station: "00004" },
    { userName: "user005", name: "User 003", station: "00005" },
    { userName: "station-00001", name: "App User for station 00001", station: "00001" },
    { userName: "station-00002", name: "App User for station 00002", station: "00002" },
    { userName: "station-00003", name: "App User for station 00003", station: "00003" },
    { userName: "station-00004", name: "App User for station 00004", station: "00004" },
    { userName: "station-00005", name: "App User for station 00005", station: "00005" }
];

export const stations: Station[] = [
    { id: "00001", name: "Vancouver" },
    { id: "00002", name: "Toronto" },
    { id: "00003", name: "Montreal" },
    { id: "00004", name: "Calgary" },
    { id: "00005", name: "Edmonton" }
];

export let temperatureReadings: TemperatureReading[] = [];
