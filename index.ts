import express, { Application, Request, Response } from "express";
import { settings } from "./src/settings";
import {
    getStations, getStationById,
    postStationTemperatureReading,
    getStationTemperatureReadings, putStationTemperatureReading, deleteStationTemperatureReadings,
    getStationTemparatureReadingById, deleteStationTemparatureReadingById,
    getStationCumulativeTemperatureReadings } from "./src/api/controllers";
import { authorizeForStation } from "./src/api/authorization";

const app: Application = express();
const port = settings.port;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get("/", async (_: Request, response: Response) => {
    return response.status(200).send({
        service: "Weather Station API",
        version: "1.0.0"
    });
});

// Mapping
app.get("/api/stations", getStations);
app.get("/api/stations/:id", getStationById);
app.get("/api/stations/:stationId/temperature-readings", authorizeForStation, getStationTemperatureReadings);
app.get("/api/stations/:stationId/cumulative-temperature-readings", authorizeForStation, getStationCumulativeTemperatureReadings);
app.post("/api/stations/:stationId/temperature-readings", authorizeForStation, postStationTemperatureReading);
app.delete("/api/stations/:stationId/temperature-readings", authorizeForStation, deleteStationTemperatureReadings);
app.get("/api/stations/:stationId/temperature-readings/:id", authorizeForStation, getStationTemparatureReadingById);
app.put("/api/stations/:stationId/temperature-readings/:id", authorizeForStation, putStationTemperatureReading);
app.delete("/api/stations/:stationId/temperature-readings/:id", authorizeForStation, deleteStationTemparatureReadingById);

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}
