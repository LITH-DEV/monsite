const express = require('express');
const cors = require('cors');
require('dotenv').config();

const projectsRouter = require('./routes/projects');
const transactionsRouter = require('./routes/transactions');
const dashboardRouter = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => res.json({ message: 'API MonSite opérationnelle ✅' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend lancé sur http://localhost:${PORT}`));
