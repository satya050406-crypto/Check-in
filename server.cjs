const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 5577;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// Request logger for diagnostics
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Initialize DB if not exists
const initDb = async () => {
    const exists = await fs.pathExists(DB_FILE);
    if (!exists) {
        await fs.writeJson(DB_FILE, { logs: [], sessions: {} });
    }
};

initDb();

// Helper to read DB
const readDb = async () => fs.readJson(DB_FILE);
// Helper to write DB
const writeDb = async (data) => fs.writeJson(DB_FILE, data, { spaces: 2 });

app.get('/api/logs', async (req, res) => {
    const db = await readDb();
    res.json(db.logs);
});

app.get('/api/sessions', async (req, res) => {
    const db = await readDb();
    res.json(db.sessions);
});

app.post('/api/checkin', async (req, res) => {
    const { staffId, staffName } = req.body;
    const db = await readDb();

    if (db.sessions[staffId]) {
        return res.status(400).json({ success: false, message: 'Already checked in' });
    }

    const checkInTime = new Date().toISOString();
    db.sessions[staffId] = { staffId, staffName, checkInTime };

    db.logs.push({
        id: Date.now(),
        staffId,
        staffName,
        type: 'CHECK_IN',
        timestamp: checkInTime
    });

    await writeDb(db);
    res.json({ success: true, data: db.sessions[staffId] });
});

app.post('/api/checkout', async (req, res) => {
    const { staffId } = req.body;
    const db = await readDb();

    if (!db.sessions[staffId]) {
        return res.status(400).json({ success: false, message: 'Not checked in' });
    }

    const session = db.sessions[staffId];
    const checkOutTime = new Date().toISOString();
    const duration = new Date(checkOutTime) - new Date(session.checkInTime);
    const durationHours = (duration / (1000 * 60 * 60)).toFixed(2);

    db.logs.push({
        id: Date.now(),
        staffId: session.staffId,
        staffName: session.staffName,
        type: 'CHECK_OUT',
        timestamp: checkOutTime,
        checkInTime: session.checkInTime,
        duration: durationHours
    });

    delete db.sessions[staffId];
    await writeDb(db);
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
