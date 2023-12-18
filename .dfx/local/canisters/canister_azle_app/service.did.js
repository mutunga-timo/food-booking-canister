export const idlFactory = ({ IDL }) => {
  const FoodBookingPayload = IDL.Record({
    'deliveryAddress' : IDL.Text,
    'quantity' : IDL.Float64,
    'foodName' : IDL.Text,
  });
  const FoodBooking = IDL.Record({
    'id' : IDL.Text,
    'deliveryAddress' : IDL.Text,
    'createdAt' : IDL.Nat64,
    'updatedAt' : IDL.Opt(IDL.Nat64),
    'quantity' : IDL.Float64,
    'foodName' : IDL.Text,
  });
  const _AzleResult = IDL.Variant({ 'Ok' : FoodBooking, 'Err' : IDL.Text });
  const _AzleResult_1 = IDL.Variant({ 'Ok' : IDL.Float64, 'Err' : IDL.Text });
  const _AzleResult_2 = IDL.Variant({
    'Ok' : IDL.Vec(FoodBooking),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'addFoodBooking' : IDL.Func([FoodBookingPayload], [_AzleResult], []),
    'countFoodBookings' : IDL.Func([], [_AzleResult_1], ['query']),
    'deleteFoodBooking' : IDL.Func([IDL.Text], [_AzleResult], []),
    'getFoodBooking' : IDL.Func([IDL.Text], [_AzleResult], ['query']),
    'getFoodBookings' : IDL.Func([], [_AzleResult_2], ['query']),
    'getFoodBookingsByTimeRange' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [_AzleResult_2],
        ['query'],
      ),
    'getFoodBookingsPaginated' : IDL.Func(
        [IDL.Float64, IDL.Float64],
        [_AzleResult_2],
        ['query'],
      ),
    'markFoodBookingAsDelivered' : IDL.Func([IDL.Text], [_AzleResult], []),
    'searchFoodBookings' : IDL.Func([IDL.Text], [_AzleResult_2], ['query']),
    'updateFoodBooking' : IDL.Func(
        [IDL.Text, FoodBookingPayload],
        [_AzleResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
