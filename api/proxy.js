const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwPiXP8qg58xlXM4HMFG1DO08_ZGlPS3ZYFyntHLlF6MLKJm8_irTlOrTQdXBABJ5cF/exec";

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