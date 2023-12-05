import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface FoodBooking {
  'id' : string,
  'deliveryAddress' : string,
  'createdAt' : bigint,
  'updatedAt' : [] | [bigint],
  'quantity' : number,
  'foodName' : string,
}
export interface FoodBookingPayload {
  'deliveryAddress' : string,
  'quantity' : number,
  'foodName' : string,
}
export type _AzleResult = { 'Ok' : FoodBooking } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : number } |
  { 'Err' : string };
export type _AzleResult_2 = { 'Ok' : Array<FoodBooking> } |
  { 'Err' : string };
export interface _SERVICE {
  'addFoodBooking' : ActorMethod<[FoodBookingPayload], _AzleResult>,
  'countFoodBookings' : ActorMethod<[], _AzleResult_1>,
  'deleteFoodBooking' : ActorMethod<[string], _AzleResult>,
  'getFoodBooking' : ActorMethod<[string], _AzleResult>,
  'getFoodBookings' : ActorMethod<[], _AzleResult_2>,
  'searchFoodBookings' : ActorMethod<[string], _AzleResult_2>,
  'updateFoodBooking' : ActorMethod<[string, FoodBookingPayload], _AzleResult>,
}
