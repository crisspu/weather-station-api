# Weather Station API

## Getting Started

### Prerequisites

- Node.js (version used 18.16.0)
- npm (version used 9.5.1)

### Installing

1. Clone the repo
   ```sh
   git clone https://github.com/crisspu/weather-station-api.git
   ```

2. Install NPM packages
   ```sh
   npm install -g newman
   npm install
   ```

### Usage

1. Run unit tests
   ```sh
   npm run unit-tests
   ```

2. Setup database
   - Open **src/settings.ts** file.
   - Update `settings.database.key` value.

2. Start the server
   ```sh
   npm run start-dev
   ```

3. Run acceptance tests (while server is running)
   ```sh
   npm run acceptance-tests-local
   ```
   - Note that the code uses the real database, so acceptance tests can't be executed from the multiple machines at the same time.
## User Stories

- As a user, I want to report a temperature
- As a user, I should only report a temperature once a minute
- As a user, I want to see my entire temperature log
- As a user, I want to delete my temperature log
- As a user, I want to see the average, high, low, and median temperature of my entire log
- [Bonus] As a user, I want to see the average, high, low, and median temperate over a specific date range
- [Bonus] As a user, I should be only able to delete, edit, and view my own temperature log
- [Bonus] As an Admin, I should be able to delete, edit, and view the temperature logs of other stations

### User Stories Notes

- 3 main entities were used: `User`, `Station`, and `Temperature Reading`.
- Temperature reading is always reported and accessed for a station, by a user.
- Every user belongs to one station.
- One station can have multiple users.
- Users are allowed to report a temperature reading only for their station.
- Users have access only to their station's temperature readings, regardless of which user(s) reported the readings.
- Users can also be admin users.
- Admin users do not have to belong to a station.
- Admin users have access to temperature readings for all stations.
- They can also report temperature readings for all stations.
- Users are currently hardcoded in **infrastructure/data.ts** file.
  - See the file to see which users have access to which stations.
- Stations are currently hardcoded in **infrastructure/data.ts** file.
- Temperature readings currently use Cosmos DB database.
  - There is also unused in-memory implementation (see **infrastructure/hardcoded-repositories.ts** file).

## Example Calls

- Not all calls are listed here. You can find all routing in **index.ts** file.
- All these calls can also be found in acceptance test Postman collection script: **test/acceptance/weather-station-api.postman_collection.json**.
- Both scripts from **test/acceptance** folder can be imported into Postman, be investigated and execued there too.
  - After both scripts are imported, select `Local` environment and run the collection.
  - Note that some requests do not support direct calls so only the whole collection should be ran.

### Get all stations

```
GET localhost:3000/api/stations
```
- This call is public and it does not need the user to be authorized.

### Get specific station

```
GET /api/stations/00001
```
- This call is public and it does not need the user to be authorized.
- Example response:
  ```json
  {
      "id": "00001",
      "name": "Vancouver"
  }
  ```

### Report station reading

```
POST /api/stations/00001/temperature-readings
Content-Type: application/json
Authorization: Basic c3RhdGlvbi0wMDAwMTo=

{
    "date": "2023-01-01T10:00:00.000Z",
    "temperatureInKelvin": 300
}
```
- The station is specified in the URL.
- This call needs the user to be authorized.
- The user used in the header is `station-00001` which is assigned to station `00001` (Vancouver).
- Example response:
  ```json
  {
      "id": "aqpqqegrdem433zm7u4nii",
      "date": "2023-01-01T10:00:00.000Z",
      "temperature": {
          "kelvin": 300,
          "celsius": 27,
          "fahrenheit": 80
      }
  }
  ```

### Update station reading

```
PUT /api/stations/00001/temperature-readings/aqpqqegrdem433zm7u4nii
Content-Type: application/json
Authorization: Basic dXNlcjAwMTo=

{
    "date": "2023-05-01T10:00:00.000Z",
    "temperatureInKelvin": 333
}
```
- The station and temperature reading id are specified in the URL.
- This call needs the user to be authorized.
- The user used in the header is `user001` which is assigned to station `00001` (Vancouver).
- The example response looks the same as in the previous example.

### Get all station readings

```
GET /api/stations/00001/temperature-readings
Authorization: Basic dXNlcjAwMTo=
```
- The station is specified in the URL.
- This call needs the user to be authorized.
- The user used in the header is `user001` which is assigned to station `00001` (Vancouver).
- The same call can be executed using admin user (`Basic YWRtaW46`).
- The example response temperature reading looks the same as in the previous example.
- Getting an individual temperature reading is also supported.

### Delete all station readings

```
DELETE /api/stations/00001/temperature-readings
Authorization: Basic dXNlcjAwMTo=
```
- The station is specified in the URL.
- This call needs the user to be authorized.
- The user used in the header is `user001` which is assigned to station `00001` (Vancouver).
- The same call can be executed using admin user (`Basic YWRtaW46`).
- Deleting an individual temperature reading is also supported.

### Get station readings within a date range

```
GET /api/stations/00001/temperature-readings?from=2013-01-01&to=2013-01-05
Authorization: Basic dXNlcjAwMTo=
```
- The station is specified in the URL.
- This call needs the user to be authorized.
- The user used in the header is `user001` which is assigned to station `00001` (Vancouver).
- The same call can be executed using admin user (`Basic YWRtaW46`).
- The call supports open ranges.
- Recordings for both dates are included in the result.
- Time can be provided (for example `2023-11-13T22:11:00.999Z`), but it will be ignored.

### Get cumulatives for all station's readings

```
GET /api/stations/00001/cumulative-temperature-readings
Authorization: Basic dXNlcjAwMTo=
```
- The station is specified in the URL.
- This call needs the user to be authorized.
- The user used in the header is `user001` which is assigned to station `00001` (Vancouver).
- The same call can be executed using admin user (`Basic YWRtaW46`).
- This call supports the date range too.
- Example response:
  ```json
  {
      "min": {
          "kelvin": 283,
          "celsius": 10,
          "fahrenheit": 50
      },
      "max": {
          "kelvin": 303,
          "celsius": 30,
          "fahrenheit": 86
      },
      "average": {
          "kelvin": 295,
          "celsius": 22,
          "fahrenheit": 71
      }
  }
  ```
- If there are no temperature recordings for the station, the call will return status code 204 with no response data.

## Notes

- The project is prepared only for local development and testing.
- All API routes are defined in **index.ts** file.
- To enable 1 minute temperature reporting throttling, set `throttleReports` property to `true` in **src/settings.ts** file.
  - Enabling this will break acceptance tests!
  - That is why the setting is disabled by default.
  - Without this setting being enabled, acceptance criteria #2 is not covered.
- Only Basic authorization is supported for now.
- User authentication was not implemented and password is not needed and it's ignored if provided.
