export const API_KEY = "b8b969778b291dfb7a094d1c8ad2bd93";

export const CITY_DATABASE = [
  // India Metros & Major Cities
  { name: 'Hyderabad', state: 'Telangana', country: 'India', code: 'IN', condition: 'Heavy Rain', temp: 24, icon: 'heavy-rain', lat: 17.3850, lon: 78.4867 },
  { name: 'Delhi', state: 'Delhi', country: 'India', code: 'IN', condition: 'Partly Cloudy', temp: 28, icon: 'cloud-sun', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', code: 'IN', condition: 'Drizzle Rain', temp: 27, icon: 'drizzle', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', code: 'IN', condition: 'Light Thunders', temp: 23, icon: 'thunder', lat: 12.9716, lon: 77.5946 },
  { name: 'Bangalore', state: 'Karnataka', country: 'India', code: 'IN', condition: 'Light Thunders', temp: 23, icon: 'thunder', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', code: 'IN', condition: 'Mostly Sunny', temp: 31, icon: 'sun', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', code: 'IN', condition: 'Humid & Sunny', temp: 32, icon: 'sun', lat: 13.0827, lon: 80.2707 },
  { name: 'Pune', state: 'Maharashtra', country: 'India', code: 'IN', condition: 'Cloudy', temp: 26, icon: 'cloud', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', code: 'IN', condition: 'Hot & Clear', temp: 34, icon: 'sun', lat: 23.0225, lon: 72.5714 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', code: 'IN', condition: 'Sunny', temp: 33, icon: 'sun', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', code: 'IN', condition: 'Hazy Sun', temp: 30, icon: 'cloud-sun', lat: 26.8467, lon: 80.9462 },
  { name: 'Chandigarh', state: 'Punjab', country: 'India', code: 'IN', condition: 'Clear', temp: 29, icon: 'sun', lat: 30.7333, lon: 76.7794 },
  { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', code: 'IN', condition: 'Partly Cloudy', temp: 28, icon: 'cloud-sun', lat: 23.2599, lon: 77.4126 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', code: 'IN', condition: 'Clear', temp: 27, icon: 'sun', lat: 22.7196, lon: 75.8577 },
  { name: 'Kochi', state: 'Kerala', country: 'India', code: 'IN', condition: 'Rain Showers', temp: 28, icon: 'rain', lat: 9.9312, lon: 76.2673 },
  { name: 'Goa', state: 'Goa', country: 'India', code: 'IN', condition: 'Tropical Rain', temp: 28, icon: 'heavy-rain', lat: 15.2993, lon: 74.1240 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', code: 'IN', condition: 'Coastal Breeze', temp: 29, icon: 'cloud-sun', lat: 17.6868, lon: 83.2185 },
  { name: 'Patna', state: 'Bihar', country: 'India', code: 'IN', condition: 'Warm', temp: 31, icon: 'sun', lat: 25.5941, lon: 85.1376 },
  { name: 'Nagpur', state: 'Maharashtra', country: 'India', code: 'IN', condition: 'Clear Skies', temp: 30, icon: 'sun', lat: 21.1458, lon: 79.0882 },
  { name: 'Bhubaneswar', state: 'Odisha', country: 'India', code: 'IN', condition: 'Thunderstorm', temp: 29, icon: 'thunder', lat: 20.2961, lon: 85.8245 },
  { name: 'Shimla', state: 'Himachal Pradesh', country: 'India', code: 'IN', condition: 'Chilly & Misty', temp: 16, icon: 'cloud', lat: 31.1048, lon: 77.1734 },
  { name: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', code: 'IN', condition: 'Cool Breeze', temp: 18, icon: 'cloud-sun', lat: 34.0837, lon: 74.7973 },

  // International Hubs
  { name: 'London', state: 'England', country: 'United Kingdom', code: 'GB', condition: 'Drizzle', temp: 18, icon: 'drizzle', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', state: 'NY', country: 'United States', code: 'US', condition: 'Partly Cloudy', temp: 22, icon: 'cloud-sun', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', state: 'Kanto', country: 'Japan', code: 'JP', condition: 'Clear', temp: 26, icon: 'sun', lat: 35.6762, lon: 139.6503 },
  { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', code: 'AE', condition: 'Sunny & Hot', temp: 38, icon: 'sun', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', state: 'Central', country: 'Singapore', code: 'SG', condition: 'Thunderstorm', temp: 29, icon: 'thunder', lat: 1.3521, lon: 103.8198 },
  { name: 'Paris', state: 'Île-de-France', country: 'France', code: 'FR', condition: 'Cloudy', temp: 20, icon: 'cloud', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', state: 'NSW', country: 'Australia', code: 'AU', condition: 'Sunny', temp: 21, icon: 'sun', lat: -33.8688, lon: 151.2093 },
  { name: 'Toronto', state: 'Ontario', country: 'Canada', code: 'CA', condition: 'Mild', temp: 19, icon: 'cloud-sun', lat: 43.6532, lon: -79.3832 },
  { name: 'San Francisco', state: 'CA', country: 'United States', code: 'US', condition: 'Foggy', temp: 17, icon: 'cloud', lat: 37.7749, lon: -122.4194 },
  { name: 'Berlin', state: 'Berlin', country: 'Germany', code: 'DE', condition: 'Showers', temp: 19, icon: 'rain', lat: 52.5200, lon: 13.4050 },
  { name: 'Rome', state: 'Lazio', country: 'Italy', code: 'IT', condition: 'Sunny', temp: 27, icon: 'sun', lat: 41.9028, lon: 12.4964 },
  { name: 'Amsterdam', state: 'North Holland', country: 'Netherlands', code: 'NL', condition: 'Light Rain', temp: 17, icon: 'drizzle', lat: 52.3676, lon: 4.9041 },
  { name: 'Bangkok', state: 'Bangkok', country: 'Thailand', code: 'TH', condition: 'Scattered Storms', temp: 31, icon: 'thunder', lat: 13.7563, lon: 100.5018 },
  { name: 'Seoul', state: 'Seoul', country: 'South Korea', code: 'KR', condition: 'Clear', temp: 23, icon: 'sun', lat: 37.5665, lon: 126.9780 },
];

export const POPULAR_CITIES = CITY_DATABASE.slice(0, 5);
export const EXPANDED_CITIES = CITY_DATABASE;

export const mapConditionToIconType = (cond) => {
  const c = (cond || '').toLowerCase();
  if (c.includes('thunder')) return 'thunder';
  if (c.includes('heavy') || (c.includes('rain') && c.includes('extreme'))) return 'heavy-rain';
  if (c.includes('rain')) return 'rain';
  if (c.includes('drizzle')) return 'drizzle';
  if (c.includes('snow')) return 'snow';
  if (c.includes('clear') || c.includes('sun')) return 'sun';
  if (c.includes('cloud') && c.includes('sun')) return 'sun-cloud';
  return 'cloud';
};
