const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = "90f7833d64f41b62b4541d1bf4f4554a
"; // Replace with your OpenWeatherMap API key
        const city = "Springfield,IL,US"; // Hardcode Springfield, IL for now

        // Fetch current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        // Fetch 5-day forecast (3-hour intervals)
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Format current weather
        const currentTemp = Math.round(currentWeatherData.main.temp);
        const condition = currentWeatherData.weather[0].main; // e.g., "Clear", "Rain"
        const conditionIcon = mapConditionToIcon(condition);

        // Format 7-day forecast (approximate daily forecast from 3-hour data)
        const dailyForecast = [];
        const daysSeen = new Set();
        for (const entry of forecastData.list) {
            const date = new Date(entry.dt * 1000);
            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            if (!daysSeen.has(dayName) && dailyForecast.length < 7) {
                daysSeen.add(dayName);
                const highTemp = Math.round(entry.main.temp_max);
                const condition = entry.weather[0].main;
                const conditionIcon = mapConditionToIcon(condition);
                dailyForecast.push(`${dayName} ${highTemp}° ${conditionIcon}`);
            }
        }

        res.status(200).json({
            current: {
                temperature: currentTemp,
                condition: condition,
                icon: conditionIcon,
                location: "Springfield, IL"
            },
            forecast: dailyForecast
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Map OpenWeatherMap conditions to emoji icons (simplified)
function mapConditionToIcon(condition) {
    switch (condition.toLowerCase()) {
        case "clear":
            return "☀️";
        case "clouds":
            return "☁️";
        case "rain":
        case "drizzle":
            return "🌧️";
        case "thunderstorm":
            return "⛈️";
        default:
            return "🌫️"; // Default for unknown conditions
    }
}