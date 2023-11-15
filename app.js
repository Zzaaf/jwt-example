require('@babel/register');
const express = require('express');
const config = require('./config/serverConfig');
const indexRouter = require('./routes/index.routes');

const app = express();
const PORT = process.env.PORT ?? 3000;

config(app);

app.use('/', indexRouter);
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
