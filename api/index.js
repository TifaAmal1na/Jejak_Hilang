const cors = require('cors');
const express = require('express');
const path = require('path');
const morgan = require('morgan');

require('dotenv').config();

const usersRoutes = require('../routes/usersRoutes');
const hilangRoutes = require('../routes/hilangRoutes');
const notificationsRoutes = require('../routes/notificationsRoutes');

const production = process.env.NODE_ENV === 'production';

const app = express();
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', (req, res) => {
	res.sendStatus(200);
});

app.use('/api/users', usersRoutes);
app.use('/api/orang_hilang', hilangRoutes);
app.use('/api/notifications', notificationsRoutes);

const static = {
	index: production ? path.resolve(__dirname) : path.resolve(__dirname, '../dist'),
	fallback: production ? path.resolve(__dirname, 'index.html') : path.resolve(__dirname, '../dist/index.html'),
};

app.use(express.static(static.index));
app.get('*', (req, res) => {
	res.sendFile(static.fallback);
});

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, () => {
	console.log('Server running on ' + process.env.BACKEND_URL);
});

module.exports = app;
