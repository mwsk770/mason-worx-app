const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = "YcjaBtI5zKDABM1wOo6a7S-cLUJH0uw8emiHswXcS8w"; // Your OneStepGPS API key
        const url = `https://track.onestepgps.com/v3/vehicles?api_key=${apiKey}`; // Updated to v3 endpoint

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OneStepGPS API responded with status: ${response.status}`);
        }
        const data = await response.json();

        // Log the raw response for debugging
        console.log("OneStepGPS API response:", data);

        // Check if the response contains vehicle data
        if (!data || !Array.isArray(data)) {
            throw new Error("Unexpected response format from OneStepGPS API: Expected an array of vehicles");
        }

        // Format the vehicle data for the app
        const vehicles = data.map(vehicle => ({
            id: vehicle.vehicle_id || vehicle.id || "Unknown ID",
            name: vehicle.vehicle_name || vehicle.name || "Unknown Vehicle",
            latitude: parseFloat(vehicle.latitude) || 0,
            longitude: parseFloat(vehicle.longitude) || 0,
            speed: parseFloat(vehicle.speed) || 0,
            status: vehicle.status || "Unknown" // e.g., "moving", "stopped", "idling"
        }));

        // Filter out vehicles with invalid coordinates
        const validVehicles = vehicles.filter(vehicle => vehicle.latitude !== 0 && vehicle.longitude !== 0);

        res.status(200).json({ vehicles: validVehicles });
    } catch (error) {
        console.error("Error fetching live tracking data:", error.message);
        res.status(500).json({ error: error.message });
    }
};