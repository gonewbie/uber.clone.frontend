import axios from 'axios';
import { toast } from 'react-toastify';

export const getCode = async (address: string) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  const { data } = await axios(URL);

  if (data.error_message) {
    toast.error(data.error_message);
    return false;
  } else {
    const { results } = data;
    const firstPlace = results[0];
    if (!firstPlace) {
      toast.error('No Place');
      return false;
    } else {
      const {
        formatted_address,
        geometry: {
          location: { lat, lng }
        }
      } = firstPlace;
      return { formatted_address, lat, lng };
    }
  }
};
export const reverseGeoCode = async (lat: number, lng: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  const { data } = await axios(URL);
  if (data.error_message) {
    toast.error(data.error_message);
  } else {
    const { results } = data;
    const firstPlace = results[0];
    if (firstPlace) {
      return firstPlace!.formatted_address;
    }
  }
}