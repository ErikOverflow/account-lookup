const express = require('express');
const app = express();
const port = 5000;

const v1 = express.Router();
const v2 = express.Router();

app.use('/api/v1', v1);
app.use('/api/v2', v2);

const ping = require('./services/ping');
v1.get('/ping', ping);
v2.get('/ping', (req,res) => res.status(200).json({message: "Successful ping", otherData: "pigs are pink"}));

app.listen(port);