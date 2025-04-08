const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const apiKey = "YcjaBtI5zKDABM1wOo6a7S-cLUJH0uw8emiHswXcS8w"; // Your OneStepGPS API key

        // Step 1: Authenticate to get a token
        const authUrl = `https://track.onestepgps.com/v3/auth/login`;
        const authResponse = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: apiKey
                // Add username and password if required by the API
                // username: "your-username",
                // password: "your-password"
            })
        });

        if (!authResponse.ok) {
            throw new Error(`OneStepGPS Auth API responded with status: ${authResponse.status}`);
        }

        const authData = await authResponse.json();
        console.log("OneStepGPS Auth API response:", authData);

        if (!authData.token) {
            throw new Error("Failed to obtain authentication token from OneStepGPS API");
        }

        const token = authData.token;

        // Step 2: Fetch device data using the token
        const devicesUrl = `https://track.onestepgps.com/v3/devices`;
        const devicesResponse = await fetch(devicesUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!devicesResponse.ok) {
            throw new Error(`OneStepGPS Devices API responded with status: ${devicesResponse.status}`);
        }

        const data = await devicesResponse.json();
        console.log("OneStepGPS Devices API response:", data);

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