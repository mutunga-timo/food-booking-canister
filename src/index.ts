import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define the type for a food booking
type FoodBooking = Record<{
    id: string;
    foodName: string;
    quantity: number;
    deliveryAddress: string;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>

// Define the type for the payload used in creating or updating a food booking
type FoodBookingPayload = Record<{
    foodName: string;
    quantity: number;
    deliveryAddress: string;
}>

// Create a storage for food bookings
const foodBookingStorage = new StableBTreeMap<string, FoodBooking>(0, 44, 1024);

/**
 * Get all food bookings.
 * @returns Result<Vec<FoodBooking>, string> - A Result containing a Vec of food bookings or an error message.
 */
$query;
export function getFoodBookings(): Result<Vec<FoodBooking>, string> {
    try {
        return Result.Ok(foodBookingStorage.values());
    } catch (error: unknown) {
        return Result.Err<Vec<FoodBooking>, string>(`Error getting food bookings: ${(error as Error).message}`);
    }
}

/**
 * Get a specific food booking by ID.
 * @param id - The ID of the food booking to retrieve.
 * @returns Result<FoodBooking, string> - A Result containing the requested food booking or an error message.
 */
$query;
export function getFoodBooking(id: string): Result<FoodBooking, string> {
    try {
        return match(foodBookingStorage.get(id), {
            Some: (foodBooking) => Result.Ok<FoodBooking, string>(foodBooking),
            None: () => Result.Err<FoodBooking, string>(`A food booking with id=${id} not found`)
        });
    } catch (error: unknown) {
        return Result.Err<FoodBooking, string>(`Error getting food booking: ${(error as Error).message}`);
    }
}

/**
 * Add a new food booking.
 * @param payload - The payload containing food booking details.
 * @returns Result<FoodBooking, string> - A Result containing the newly added food booking or an error message.
 */
$update;
export function addFoodBooking(payload: FoodBookingPayload): Result<FoodBooking, string> {
    try {
        // Validate input
        if (!payload.foodName || !payload.quantity || !payload.deliveryAddress) {
            return Result.Err<FoodBooking, string>('Invalid input. Please provide all required fields.');
        }

        // Check for duplicate food name
        const existingBooking = foodBookingStorage
            .values()
            .find((booking) => booking.foodName.toLowerCase() === payload.foodName.toLowerCase());

        if (existingBooking) {
            return Result.Err<FoodBooking, string>('Food name must be unique.');
        }

        // Validate quantity
        const quantity = Number(payload.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            return Result.Err<FoodBooking, string>('Quantity must be a positive integer.');
        }

        // Create and insert the food booking
        const foodBooking: FoodBooking = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload };
        foodBookingStorage.insert(foodBooking.id, foodBooking);

        return Result.Ok(foodBooking);
    } catch (error: unknown) {
        return Result.Err<FoodBooking, string>(`Error adding food booking: ${(error as Error).message}`);
    }
}

/**
 * Update an existing food booking by ID.
 * @param id - The ID of the food booking to update.
 * @param payload - The payload containing updated food booking details.
 * @returns Result<FoodBooking, string> - A Result containing the updated food booking or an error message.
 */
$update;
export function updateFoodBooking(id: string, payload: FoodBookingPayload): Result<FoodBooking, string> {
    try {
        // Validate input
        if (!payload.foodName || !payload.quantity || !payload.deliveryAddress) {
            return Result.Err<FoodBooking, string>('Invalid input. Please provide all required fields.');
        }

        // Check for duplicate food name
        const existingBooking = foodBookingStorage
            .values()
            .find(
                (booking) =>
                    booking.foodName.toLowerCase() === payload.foodName.toLowerCase() && booking.id !== id
            );

        if (existingBooking) {
            return Result.Err<FoodBooking, string>('Food name must be unique.');
        }

        // Validate quantity
        const quantity = Number(payload.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            return Result.Err<FoodBooking, string>('Quantity must be a positive integer.');
        }

        // Update the food booking
        return match(foodBookingStorage.get(id), {
            Some: (foodBooking) => {
                const updatedFoodBooking: FoodBooking = { ...foodBooking, ...payload, updatedAt: Opt.Some(ic.time()) };
                foodBookingStorage.insert(foodBooking.id, updatedFoodBooking);
                return Result.Ok<FoodBooking, string>(updatedFoodBooking);
            },
            None: () => Result.Err<FoodBooking, string>(`Couldn't update a food booking with id=${id}. Food booking not found`)
        });
    } catch (error: unknown) {
        return Result.Err<FoodBooking, string>(`Error updating food booking: ${(error as Error).message}`);
    }
}

/**
 * Delete a food booking by ID.
 * @param id - The ID of the food booking to delete.
 * @returns Result<FoodBooking, string> - A Result containing the deleted food booking or an error message.
 */
$update;
export function deleteFoodBooking(id: string): Result<FoodBooking, string> {
    try {
        return match(foodBookingStorage.remove(id), {
            Some: (deletedFoodBooking) => Result.Ok<FoodBooking, string>(deletedFoodBooking),
            None: () => Result.Err<FoodBooking, string>(`Couldn't delete a food booking with id=${id}. Food booking not found.`)
        });
    } catch (error: unknown) {
        return Result.Err<FoodBooking, string>(`Error deleting food booking: ${(error as Error).message}`);
    }
}

/**
 * Search for food bookings based on a keyword.
 * @param keyword - The keyword to search for in food names and delivery addresses.
 * @returns Result<Vec<FoodBooking>, string> - A Result containing a Vec of filtered food bookings or an error message.
 */
$query;
export function searchFoodBookings(keyword: string): Result<Vec<FoodBooking>, string> {
    try {
        const filteredBookings = foodBookingStorage
            .values()
            .filter((booking) =>
                booking.foodName.toLowerCase().includes(keyword.toLowerCase()) ||
                booking.deliveryAddress.toLowerCase().includes(keyword.toLowerCase())
            );

        return Result.Ok(filteredBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<FoodBooking>, string>(`Error searching food bookings: ${(error as Error).message}`);
    }
}

/**
 * Count the total number of food bookings.
 * @returns Result<number, string> - A Result containing the count of food bookings or an error message.
 */
$query;
export function countFoodBookings(): Result<number, string> {
    try {
        const count = foodBookingStorage.len();

        // Convert the bigint to number
        const countAsNumber = Number(count);

        return Result.Ok(countAsNumber);
    } catch (error: unknown) {
        return Result.Err<number, string>(`Error counting food bookings: ${(error as Error).message}`);
    }
}

/**
 * Get a paginated list of food bookings.
 * @param page - The page number.
 * @param pageSize - The number of items per page.
 * @returns Result<Vec<FoodBooking>, string> - A Result containing a Vec of paginated food bookings or an error message.
 */
$query;
export function getFoodBookingsPaginated(page: number, pageSize: number): Result<Vec<FoodBooking>, string> {
    try {
        const startIdx = (page - 1) * pageSize;
        const paginatedBookings = foodBookingStorage.values().slice(startIdx, startIdx + pageSize);

        return Result.Ok(paginatedBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<FoodBooking>, string>(`Error getting paginated food bookings: ${(error as Error).message}`);
    }
}

/**
 * Get food bookings created within a specific time range.
 * @param startTime - The start time of the range.
 * @param endTime - The end time of the range.
 * @returns Result<Vec<FoodBooking>, string> - A Result containing a Vec of filtered food bookings or an error message.
 */
$query;
export function getFoodBookingsByTimeRange(startTime: nat64, endTime: nat64): Result<Vec<FoodBooking>, string> {
    try {
        const filteredBookings = foodBookingStorage
            .values()
            .filter((booking) => booking.createdAt >= startTime && booking.createdAt <= endTime);

        return Result.Ok(filteredBookings);
    } catch (error: unknown) {
        return Result.Err<Vec<FoodBooking>, string>(`Error getting food bookings by time range: ${(error as Error).message}`);
    }
}

/**
 * Mark a food booking as delivered.
 * @param id - The ID of the food booking to mark as delivered.
 * @returns Result<FoodBooking, string> - A Result containing the updated food booking or an error message.
 */
$update;
export function markFoodBookingAsDelivered(id: string): Result<FoodBooking, string> {
    try {
        return match(foodBookingStorage.get(id), {
            Some: (foodBooking) => {
                const updatedFoodBooking: FoodBooking = { ...foodBooking, updatedAt: Opt.Some(ic.time()) };
                foodBookingStorage.insert(foodBooking.id, updatedFoodBooking);
                return Result.Ok<FoodBooking, string>(updatedFoodBooking);
            },
            None: () => Result.Err<FoodBooking, string>(`Couldn't mark food booking with id=${id} as delivered. Food booking not found`)
        });
    } catch (error: unknown) {
        return Result.Err<FoodBooking, string>(`Error marking food booking as delivered: ${(error as Error).message}`);
    }
}

// Workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};
