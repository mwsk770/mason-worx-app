const { google } = require('googleapis');

module.exports = async (req, res) => {
    try {
        // Load the service account credentials from environment variable
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1aRcDxUFRK6NVRfT3e1aX_XyOD_iS3WlDv6A1C1S1mIE'; // Replace with your Spreadsheet ID

        // Read Users sheet
        const usersResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Users!A2:E'
        });
        const users = usersResponse.data.values ? usersResponse.data.values.map(row => ({
            email: row[0] || '',
            password: row[1] || '',
            name: row[2] || '',
            role: row[3] || '',
            firstLogin: row[4] === 'true'
        })) : [];

        // Read Messages sheet
        const messagesResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Messages!A2:E'
        });
        const messages = messagesResponse.data.values ? messagesResponse.data.values.map(row => ({
            sender: row[0] || '',
            senderName: row[1] || '',
            recipient: row[2] || '',
            message: row[3] || '',
            timestamp: row[4] || ''
        })) : [];

        // Read Tasks sheet
        const tasksResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Tasks!A2:B'
        });
        const tasks = tasksResponse.data.values ? tasksResponse.data.values.map(row => ({
            description: row[0] || '',
            assignee: row[1] || ''
        })) : [];

        res.status(200).json({ users, messages, tasks });
    } catch (error) {
        console.error("Error reading from Google Sheet:", error.message);
        res.status(500).json({ error: error.message });
    }
};