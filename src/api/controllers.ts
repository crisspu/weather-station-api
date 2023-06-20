import { Request, Response } from 'express';
import { stationRepository, temperatureReadingsRepository } from '../infrastructure/repositories';
import { TemperatureReading } from '../domain/entities';
import { CumulativeTemperatureReading, Temperature } from '../domain/value-objects';
import {  StationModel, TemperatureReadingModel, CumulativeTemperatureReadingModel,
    TemperatureReadingToAddModel, TemperatureReadingToUpdateModel } from './models';

export const settings = { throttleReports: false };

export const getStations = async (_: Request, response: Response) => {
    return response.status(200).send(stationRepository.getAll().map(s => new StationModel(s)));
};

export const getStationById = async (request: Request, response: Response) => {
    const { id } = request.params;
    const station = stationRepository.getById(id);
    if (!station)
        return response.status(404).send({ error: `Station ${id} not found.` });

    return response.status(200).send(new StationModel(station));
};

export const getStationTemperatureReadings = async (request: Request, response: Response) => {
    const { stationId } = request.params;
    const { from, to } = getDateRange(request);
    const readings = temperatureReadingsRepository.getForStation(stationId, from, to);

    return response.status(200).send(readings.map(r => new TemperatureReadingModel(r)));
};

export const getStationCumulativeTemperatureReadings = async (request: Request, response: Response) => {
    const { stationId } = request.params;
    const { from, to } = getDateRange(request);
    const readings = temperatureReadingsRepository.getForStation(stationId, from, to);
    const cumulatives = CumulativeTemperatureReading.create(readings);
    if (!cumulatives)
        return response.status(204).send();

    return response.status(200).send(new CumulativeTemperatureReadingModel(cumulatives));
};

export const getStationTemparatureReadingById = async (request: Request, response: Response) => {
    const { stationId, id } = request.params;
    const reading = temperatureReadingsRepository.getById(id);
    if (!reading)
        return response.status(404).send({ error: `Temparature reading ${id} not found.` });
    if (reading.stationId !== stationId)
        return response.status(404).send({ error: `Temparature reading ${id} not found for station ${stationId}.` });

    return response.status(200).send(new TemperatureReadingModel(reading));
};

export const postStationTemperatureReading = async (request: TemperatureReadingToAddRequest, response: Response) => {
    // Get and validate station
    const { stationId } = request.params;
    const station = stationRepository.getById(stationId);
    if (!station)
        return response.status(400).send({ error: `Station ${stationId} not found.` });

    // Validate the last reported time
    const timeStamp = new Date();
    if (settings.throttleReports) {
        const lastTimeStamp = temperatureReadingsRepository.getLastTimeStampForStation(stationId);
        if (Math.abs(timeStamp.getTime() - lastTimeStamp.getTime()) < 60000)
            return response.status(400).send({ error: `A temperature can be reported only once a minute.` });
    }

    // Get and validate temperature and date
    const { date, temperatureInKelvin } = request.body;
    const temperature = Temperature.create(temperatureInKelvin);
    if (!temperature)
        return response.status(400).send({ error: `Temperature ${temperatureInKelvin} is not a valid value.` });
    const readingDate = getDate(date);
    if (!readingDate)
        return response.status(400).send({ error: `Date ${date} is not a valid value.` });

    const reading = TemperatureReading.create(
        temperatureReadingsRepository.getNextId(), timeStamp, readingDate,
        temperature, station.id);
    temperatureReadingsRepository.save(reading);

    return response.status(201).send(new TemperatureReadingModel(reading));
};

export const putStationTemperatureReading = async (request: TemperatureReadingToUpdateRequest, response: Response) => {
    // Get and validate station
    const { stationId, id } = request.params;
    const reading = temperatureReadingsRepository.getById(id);
    if (!reading)
        return response.status(404).send({ error: `Temparature reading ${id} not found.` });
    if (reading.stationId !== stationId)
        return response.status(404).send({ error: `Temparature reading ${id} not found for station ${stationId}.` });

    // Get and validate temperature and date
    const { date, temperatureInKelvin } = request.body;
    const temperature = Temperature.create(temperatureInKelvin);
    if (!temperature)
        return response.status(400).send({ error: `Temperature ${temperatureInKelvin} is not a valid value.` });
    const readingDate = getDate(date);
    if (!readingDate)
        return response.status(400).send({ error: `Date ${date} is not a valid value.` });
    
    reading.temperature = temperature;
    reading.date = readingDate;
    temperatureReadingsRepository.save(reading);

    return response.status(200).send(new TemperatureReadingModel(reading));
};

export const deleteStationTemperatureReadings = async (request: Request, response: Response) => {
    const { stationId } = request.params;
    const readings = temperatureReadingsRepository.getForStation(stationId);

    readings.forEach(r => {
        temperatureReadingsRepository.delete(r);
    });

    return response.status(204).send();
};

export const deleteStationTemparatureReadingById = async (request: Request, response: Response) => {
    const { stationId, id } = request.params;
    const reading = temperatureReadingsRepository.getById(id);
    if (!reading)
        return response.status(404).send({ error: `Temparature reading ${id} not found.` });
    if (reading.stationId !== stationId)
        return response.status(404).send({ error: `Temparature reading ${id} not found for station ${stationId}.` });

    temperatureReadingsRepository.delete(reading);

    return response.status(204).send();
};

function getDateRange(request: Request): { from: Date | undefined, to : Date | undefined } {
    const { from, to } = request.query;

    let fromDateResult: Date | undefined = undefined;
    let toDateResult: Date | undefined = undefined;

    if (typeof from === "string") {
        const fromDate = getDate(from);
        if (fromDate)
            fromDateResult = getDateOnly(fromDate);
    }

    if (typeof to === "string") {
        const toDate = getDate(to);
        if (toDate)
            toDateResult = new Date(getDateOnly(toDate).getTime() + 86400000);
    }

    return { from: fromDateResult, to: toDateResult };
}

export function getDateOnly(date: Date): Date {
    return new Date(date.toISOString().substring(0, 10));
}

export function getDate(date: string | undefined): Date | undefined {
    if (!date)
        return undefined;

    const result = new Date(date);
    return isNaN(result.getTime()) ? undefined : result;
}

interface TemperatureReadingToAddRequest extends Request {
    body: TemperatureReadingToAddModel;
};

interface TemperatureReadingToUpdateRequest extends Request {
    body: TemperatureReadingToUpdateModel;
};
