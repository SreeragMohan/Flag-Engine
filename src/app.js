const express = require('express');

const flagsRouter = require('./routes/flags');
const overridesRouter = require('./routes/overrides');
const resolveRouter = require('./routes/resolve');

const app = express();

app.use(express.json());

app.use('/flags', flagsRouter);
app.use('/flags/:key/overrides', overridesRouter);
app.use('/resolve', resolveRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
