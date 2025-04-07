const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = "2d79f7cfb6e84ec3971ea5fa4668d837"; // Replace with your WeatherBit API key
        const { lat, lon } = req.query; // Get latitude and longitude from the request

        if (!lat || !lon) {
            throw new Error("Latitude and longitude are required.");
        }

        // Fetch current weather
        const currentWeatherUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}&units=I`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        // Fetch 7-day daily forecast
        const dailyForecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${apiKey}&units=I&days=7`;
        const dailyForecastResponse = await fetch(dailyForecastUrl);
        const dailyForecastData = await dailyForecastResponse.json();

        // Fetch hourly forecast (24 hours)
        const hourlyForecastUrl = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&key=${apiKey}&units=I&hours=24`;
        const hourlyForecastResponse = await fetch(hourlyForecastUrl);
        const hourlyForecastData = await hourlyForecastResponse.json();

        // Fetch minute-by-minute precipitation forecast (60 minutes)
        const minuteForecastUrl = `https://api.weatherbit.io/v2.0/forecast/minutely?lat=${lat}&lon=${lon}&key=${apiKey}&units=I`;
        const minuteForecastResponse = await fetch(minuteForecastUrl);
        const minuteForecastData = await minuteForecastResponse.json();

        // Format current weather
        const currentTemp = Math.round(currentWeatherData.data[0].temp);
        const condition = currentWeatherData.data[0].weather.description; // e.g., "Clear sky", "Light rain"
        const conditionIcon = mapConditionToIcon(condition);
        const location = currentWeatherData.data[0].city_name + ", " + currentWeatherData.data[0].state_code;

        // Format 7-day forecast with hourly data for each day
        const forecastDaily = dailyForecastData.data;
        const forecast = forecastDaily.map((day, index) => {
            const date = new Date(day.datetime);
            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            const highTemp = Math.round(day.max_temp);
            const lowTemp = Math.round(day.min_temp);
            const condition = day.weather.description;
            const conditionIcon = mapConditionToIcon(condition);

            // Get hourly forecast for this day (filter from the 24-hour data)
            const hourly = hourlyForecastData.data
                .filter(hour => new Date(hour.timestamp_local).toLocaleDateString() === date.toLocaleDateString())
                .map(hour => ({
                    time: new Date(hour.timestamp_local).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    temp: Math.round(hour.temp),
                    condition: hour.weather.description,
                    conditionIcon: mapConditionToIcon(hour.weather.description),
                    precipitation: hour.precip ? hour.precip : 0 // Precipitation in mm/hr
                }));

            return {
                dayName: dayName,
                highTemp: highTemp,
                lowTemp: lowTemp,
                condition: condition,
                conditionIcon: conditionIcon,
                hourly: hourly
            };
        });

        // Format minute-by-minute precipitation forecast (60 minutes)
        const minuteForecast = minuteForecastData.data.slice(0, 60).map((entry, index) => {
            const time = new Date(entry.timestamp_local).toLocaleTimeString('en-US', { minute: '2-digit' });
            return {
                time: time,
                precipitation: entry.precip // Precipitation in mm/hr
            };
        });

        res.status(200).json({
            current: {
                temperature: currentTemp,
                condition: condition,
                icon: conditionIcon,
                location: location
            },
            forecast: forecast,
            minuteForecast: minuteForecast
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Map WeatherBit conditions to emoji icons (simplified)
function mapConditionToIcon(condition) {
    switch (condition.toLowerCase()) {
        case "clear sky":
            return "☀️";
        case "few clouds":
        case "scattered clouds":
        case "broken clouds":
        case "overcast clouds":
            return "☁️";
        case "light rain":
        case "moderate rain":
        case "heavy rain":
        case "rain":
            return "🌧️";
        case "thunderstorm":
            return "⛈️";
        default:
            return "🌫️"; // Default for unknown conditions
    }
}