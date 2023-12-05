# Food Booking System Documentation

## Overview

The Food Booking System is a JavaScript implementation that utilizes the Azle library for efficient data storage and management. This system allows users to perform various operations related to food bookings, including adding, updating, retrieving, and deleting food bookings. Additionally, users can search for food bookings based on keywords, count the total number of bookings, and retrieve paginated lists of bookings.

## Features

### 1. Get All Food Bookings

- **Function:** `getFoodBookings()`
- **Description:** Retrieve a list of all food bookings.
- **Return Type:** `Result<Vec<FoodBooking>, string>`

### 2. Get Food Booking by ID

- **Function:** `getFoodBooking(id: string)`
- **Description:** Retrieve a specific food booking by providing its ID.
- **Parameters:**
  - `id` (string): The unique identifier of the food booking.
- **Return Type:** `Result<FoodBooking, string>`

### 3. Add a New Food Booking

- **Function:** `addFoodBooking(payload: FoodBookingPayload)`
- **Description:** Add a new food booking with details specified in the payload.
- **Parameters:**
  - `payload` (FoodBookingPayload): Object containing food booking details.
- **Return Type:** `Result<FoodBooking, string>`

### 4. Update Existing Food Booking

- **Function:** `updateFoodBooking(id: string, payload: FoodBookingPayload)`
- **Description:** Update an existing food booking by providing its ID and updated details.
- **Parameters:**
  - `id` (string): The unique identifier of the food booking to be updated.
  - `payload` (FoodBookingPayload): Object containing updated food booking details.
- **Return Type:** `Result<FoodBooking, string>`

### 5. Delete Food Booking by ID

- **Function:** `deleteFoodBooking(id: string)`
- **Description:** Delete a specific food booking by providing its ID.
- **Parameters:**
  - `id` (string): The unique identifier of the food booking to be deleted.
- **Return Type:** `Result<FoodBooking, string>`

### 6. Search Food Bookings

- **Function:** `searchFoodBookings(keyword: string)`
- **Description:** Search for food bookings based on a keyword in food names and delivery addresses.
- **Parameters:**
  - `keyword` (string): The keyword to search for.
- **Return Type:** `Result<Vec<FoodBooking>, string>`

### 7. Count Total Food Bookings

- **Function:** `countFoodBookings()`
- **Description:** Count the total number of food bookings.
- **Return Type:** `Result<number, string>`

### 8. Get Paginated Food Bookings

- **Function:** `getFoodBookingsPaginated(page: number, pageSize: number)`
- **Description:** Retrieve a paginated list of food bookings.
- **Parameters:**
  - `page` (number): The page number.
  - `pageSize` (number): The number of items per page.
- **Return Type:** `Result<Vec<FoodBooking>, string>`

## Deployment

### Prerequisites

- Node.js installed on the server.

### Steps

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/mutunga-timo/food-booking-canister.git
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm start
   ```
   4. Deploy the application:

   ```bash
   npm deploy
   ```