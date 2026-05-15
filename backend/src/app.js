const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const aiRoutes = require('./routes/aiRoutes');
const securityRoutes = require('./routes/securityRoutes');

const promptRoutes = require('./routes/promptRoutes');

const documentRoutes = require('./routes/documentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(aiRoutes);
app.use(securityRoutes);
app.use(promptRoutes);
app.use(documentRoutes);
module.exports = app;
