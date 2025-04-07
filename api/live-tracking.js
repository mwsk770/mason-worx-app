const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = "YcjaBtI5zKDABM1wOo6a7S-cLUJH0uw8emiHswXcS8w"; // Replace with your OneStepGPS API key
        const url = `https://api.onestepgps.com/v1/vehicles?api_key=${apiKey}`; // Example endpoint; check OneStepGPS API docs for the correct endpoint

        const response = await fetch(url);
        const data = await response.json();

        // Format the data to include vehicle ID, name, latitude, longitude, speed, and status
        const vehicles = data.vehicles.map(vehicle => ({
            id: vehicle.vehicle_id,
            name: vehicle.vehicle_name,
            latitude: vehicle.latitude,
            longitude: vehicle.longitude,
            speed: vehicle.speed,
            status: vehicle.status // e.g., "moving", "stopped", "idling"
        }));

        res.status(200).json({ vehicles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};