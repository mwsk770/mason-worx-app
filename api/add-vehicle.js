const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        // Ensure the request is a POST
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed. Use POST.' });
        }

        // Extract vehicle details from the request body
        const { name, vin, licensePlate, deviceId } = req.body;
        if (!name || !deviceId) {
            return res.status(400).json({ error: 'Missing required fields: name and deviceId are required.' });
        }

        const apiKey = "YcjaBtI5zKDABM1wOo6a7S-cLUJH0uw8emiHswXcS8w"; // Your OneStepGPS API key
        const url = `https://track.onestepgps.com/v3/vehicles?api_key=${apiKey}`; // Endpoint to add a vehicle

        // Prepare the vehicle data
        const vehicleData = {
            vehicle_name: name,
            vin: vin || '',
            license_plate: licensePlate || '',
            device_id: deviceId // The ID of the GPS tracker device
        };

        // Send the POST request to OneStepGPS API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehicleData)
        });

        if (!response.ok) {
            throw new Error(`OneStepGPS API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("OneStepGPS API response:", data);

        res.status(200).json({ success: true, vehicle: data });
    } catch (error) {
        console.error("Error adding vehicle:", error.message);
        res.status(500).json({ error: error.message });
    }
};