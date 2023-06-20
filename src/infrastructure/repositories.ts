import { HardcodedStationRepository, HardcodedUserRepository, InMemoryTemperatureReadingsRepository } from "./hardcoded-repositories";

export const userRepository = new HardcodedUserRepository();
export const stationRepository = new HardcodedStationRepository();
export const temperatureReadingsRepository = new InMemoryTemperatureReadingsRepository();
