const express = require('express');
const config = require('./config/serverConfig');
const mainRouter = require('./routes/views/main.routes');
const apiRouter = require('./routes/api/main.api.routes');

const app = express();
const PORT = process.env.PORT ?? 3000;

config(app);

app.use('/', mainRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
