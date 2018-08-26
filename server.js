const express = require('express');
const cors = require('cors');
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser');

const apiRouter = require('./api/api');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// use the router in /api/api.js
app.use('/api', apiRouter);

app.use(errorhandler());

// start server listening on PORT
 app.listen(PORT, () => {   
    console.log(`Server is listening on port ${PORT}`);
  });

module.exports = app;