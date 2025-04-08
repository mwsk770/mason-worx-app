const { google } = require('googleapis');

module.exports = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed. Use POST.' });
        }

        const { sheet, data } = req.body;
        if (!sheet || !data) {
            return res.status(400).json({ error: 'Missing required fields: sheet and data.' });
        }

        // Load the service account credentials from environment variable
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1aRcDxUFRK6NVRfT3e1aX_XyOD_iS3WlDv6A1C1S1mIE'; // Replace with your Spreadsheet ID

        // Append the data to the specified sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: `${sheet}!A:E`,
            valueInputOption: 'RAW',
            resource: {
                values: [data]
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error writing to Google Sheet:", error.message);
        res.status(500).json({ error: error.message });
    }
};