const config = require('../config');
const axios = require('axios');

const axiosOptions = {
  headers: {
    "X-Riot-Token": process.env.RIOTKEY,
  },
};

const getSummonerByName = async (region,summonerName) => {
    const res = await axios.get(config.summonerByNameUrl(region, summonerName), axiosOptions);
    return res.data;
}

const summonerParser = async (req,res) => {
    if(!req.query.summonerName || !req.query.region){
        return res.status(403).json({error: "Missing summoner name or region."});
    }
    const summonerData = await getSummonerByName(req.query.region, req.query.summonerName);
    return res.status(200).json(summonerData);
    
}

module.exports = {
    summonerParser
}