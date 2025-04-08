const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = "YcjaBtI5zKDABM1wOo6a7S-cLUJH0uw8emiHswXcS8w"; // Your OneStepGPS API key
        const url = `https://track.onestepgps.com/v3/devices`; // Endpoint to fetch devices

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`OneStepGPS API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("OneStepGPS API response:", data);

        // Check if the response contains device data
        if (!data || !Array.isArray(data)) {
            throw new Error("Unexpected response format from OneStepGPS API: Expected an array of devices");
        }

        // Format the device data as vehicles for the app
        const vehicles = data.map(device => ({
            id: device.factory_id || device.id || "Unknown ID",
            name: device.name || "Unknown Vehicle",
            latitude: parseFloat(device.latitude) || 0,
            longitude: parseFloat(device.longitude) || 0,
            speed: parseFloat(device.speed) || 0,
            status: device.status || "Unknown" // e.g., "moving", "stopped", "idling"
        }));

        // Filter out vehicles with invalid coordinates
        const validVehicles = vehicles.filter(vehicle => vehicle.latitude !== 0 && vehicle.longitude !== 0);

        res.status(200).json({ vehicles: validVehicles });
    } catch (error) {
        console.error("Error fetching live tracking data:", error.message);
        res.status(500).json({ error: error.message });
    }
};