# Parking REST API
REST API for the Parking App.

## API Routes

### Authentication

- `POST /api/auth/register`: register a user.
- `POST /api/auth/login`: log in and generate a JWT token for authentication.

### Parking Zone (admins only)

- `POST /api/parkings`: create a new parking zone.
- `GET /api/parkings`: list of all parking zones.
- `GET /api/parkings/:id`: get a specific parking zone.
- `PATCH /api/parkings/:id`: update parking zone.
- `DELETE /api/parkings/:id`: delete parking zone.

### User Cars 

- `POST /api/cars`: add a new car.
- `POST /api/cars/:parking_id/add-car/:car_id`: add car to a parking zone.
- `GET /api/cars`: list of all cars.
- `GET /api/cars/:id`: get a specific car.
- `PATCH /api/cars/:id`: update car.
- `DELETE /api/cars/:id`: delete car.


### Authorization

- include an admin JWT token in the Authorization header for perms

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tvxxd/PARKING-REST-API.git
   cd PARKING-REST-API

2. Install all dependencies
   ```bash
   npm i

3. Set up your environment variables, including database configuration and JWT secret key, in a .env file.
  - PORT=
  - USER=
  - PASSWORD=
  - DATABASE=
  - DB_PORT=
  - HOST=
  - JWT_KEY=

4. Start
    ```bash
    npm run dev

3. Use Postman
