require('@babel/register');
const express = require('express');
const config = require('./config/serverConfig');
const mainRouter = require('./routes');

const app = express();
const PORT = process.env.PORT ?? 3000;

config(app);

app.use('/', mainRouter);

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
