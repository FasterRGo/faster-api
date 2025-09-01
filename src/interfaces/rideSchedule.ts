export interface IRideSchedule {
  initialLatitudeLocation: number;
  initialLongitudeLocation: number;
  finalLatitudeLocation: number;
  finalLongitudeLocation: number;
  userId?: number;
  driverId: number;
  price: number;
  originCity: string;
  destinationCity: string;
  scheduledDate: string;
  maxPassengers: number;
}
