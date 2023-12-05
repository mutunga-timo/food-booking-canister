import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

type FoodBooking = Record<{
    id: string;
    foodName: string;
    quantity: number;
    deliveryAddress: string;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>

type FoodBookingPayload = Record<{
    foodName: string;
    quantity: number;
    deliveryAddress: string;
}>

const foodBookingStorage = new StableBTreeMap<string, FoodBooking>(0, 44, 1024);

$query;
export function getFoodBookings(): Result<Vec<FoodBooking>, string> {
    return Result.Ok(foodBookingStorage.values());
}

$query;
export function getFoodBooking(id: string): Result<FoodBooking, string> {
    return match(foodBookingStorage.get(id), {
        Some: (foodBooking) => Result.Ok<FoodBooking, string>(foodBooking),
        None: () => Result.Err<FoodBooking, string>(`A food booking with id=${id} not found`)
    });
}

$update;
export function addFoodBooking(payload: FoodBookingPayload): Result<FoodBooking, string> {
    // Validate input
    if (!payload.foodName || !payload.quantity || !payload.deliveryAddress) {
        return Result.Err<FoodBooking, string>('Invalid input. Please provide all required fields.');
    }

    const quantity = Number(payload.quantity);
    if (isNaN(quantity) || quantity <= 0) {
        return Result.Err<FoodBooking, string>('Quantity must be a positive integer.');
    }

    // Create and insert the food booking
    const foodBooking: FoodBooking = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload };
    foodBookingStorage.insert(foodBooking.id, foodBooking);
    
    return Result.Ok(foodBooking);
}

$update;
export function updateFoodBooking(id: string, payload: FoodBookingPayload): Result<FoodBooking, string> {
    return match(foodBookingStorage.get(id), {
        Some: (foodBooking) => {
            const updatedFoodBooking: FoodBooking = { ...foodBooking, ...payload, updatedAt: Opt.Some(ic.time()) };
            foodBookingStorage.insert(foodBooking.id, updatedFoodBooking);
            return Result.Ok<FoodBooking, string>(updatedFoodBooking);
        },
        None: () => Result.Err<FoodBooking, string>(`Couldn't update a food booking with id=${id}. Food booking not found`)
    });
}

$update;
export function deleteFoodBooking(id: string): Result<FoodBooking, string> {
    return match(foodBookingStorage.remove(id), {
        Some: (deletedFoodBooking) => Result.Ok<FoodBooking, string>(deletedFoodBooking),
        None: () => Result.Err<FoodBooking, string>(`Couldn't delete a food booking with id=${id}. Food booking not found.`)
    });
}
$query;
export function searchFoodBookings(keyword: string): Result<Vec<FoodBooking>, string> {
    const filteredBookings = foodBookingStorage
        .values()
        .filter((booking) =>
            booking.foodName.toLowerCase().includes(keyword.toLowerCase()) ||
            booking.deliveryAddress.toLowerCase().includes(keyword.toLowerCase())
        );

    return Result.Ok(filteredBookings);
}
$query;
export function countFoodBookings(): Result<number, string> {
    const count = foodBookingStorage.len();

    // Convert the bigint to number
    const countAsNumber = Number(count);

    return Result.Ok(countAsNumber);
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
