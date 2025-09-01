
export interface IRide {
    initialLatitudeLocation: number,
    initialLongitudeLocation: number,
    finalLatitudeLocation: number,
    finalLongitudeLocation: number,
    userId: number,
    driverId?: number,
    price: number,
}