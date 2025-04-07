const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = "YcjaBtI5zKDABM1wOo6a7S-cLUJH0uw8emiHswXcS8w"; // Your OneStepGPS API key
        const url = `https://api.onestepgps.com/v1/vehicles?api_key=${apiKey}`; // Placeholder endpoint; update with the correct OneStepGPS endpoint

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OneStepGPS API responded with status: ${response.status}`);
        }
        const data = await response.json();

        // Format the data to include vehicle ID, name, latitude, longitude, speed, and status
        // Adjust this based on the actual OneStepGPS API response structure
        if (!data.vehicles || !Array.isArray(data.vehicles)) {
            throw new Error("Unexpected response format from OneStepGPS API");
        }
        const vehicles = data.vehicles.map(vehicle => ({
            id: vehicle.vehicle_id || vehicle.id || "Unknown ID",
            name: vehicle.vehicle_name || vehicle.name || "Unknown Vehicle",
            latitude: vehicle.latitude || 0,
            longitude: vehicle.longitude || 0,
            speed: vehicle.speed || 0,
            status: vehicle.status || "Unknown" // e.g., "moving", "stopped", "idling"
        }));

        res.status(200).json({ vehicles });
    } catch (error) {
        console.error("Error fetching live tracking data:", error.message);
        res.status(500).json({ error: error.message });
    }
};