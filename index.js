const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const v1 = express.Router();
const v2 = express.Router();

app.use('/api/v1', v1);
app.use('/api/v2', v2);

const ping = require('./services/ping');
v1.get('/ping', ping);
v2.get('/ping', (req,res) => res.status(200).json({message: "Successful ping", otherData: "pigs are pink"}));
const summoner = require('./services/summoner');
v1.get('/summoner', summoner.summonerParser);

app.listen(process.env.PORT, () => console.log(`Server is now listening on port: ${process.env.PORT}`));