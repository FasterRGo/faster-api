import axios from "axios";
interface ICalculate {
    from: {
        latitude: number,
        longitude: number
    },
    to: {
        latitude: number,
        longitude: number
    }
}

import { env } from "../environment";

const RATE_PER_RIDE = 2.3
const { ORS_API_KEY } = env;

const calculate = async ({ from, to }: ICalculate) => {

    const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
        params: {
            api_key: ORS_API_KEY,
            start: `${from.longitude},${from.latitude}`,
            end: `${to.longitude},${to.latitude}`,
        },
    });

    const data = response.data;

    if (!data || data.features.length === 0) {
        throw new Error('No route found');
    }


    const route = data.features[0].properties.segments[0];
    const distanceInKm = route.distance / 1000;
    const costInReais = Number((distanceInKm * RATE_PER_RIDE).toFixed(2));

    return { ...route, price: costInReais }
}

export { calculate }