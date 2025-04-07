const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwJbMStUgwv2tsjXPqOIH8HICy94CPAKFKAACrR3RiDJjCQKStakKBM5iJ4UbQBCEq0gw/exec";

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};