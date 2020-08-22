const getPlayerDetail = async (req, res) => {
    let soloDetail, flexDetail;
    if(req.summoner.ranked){
        soloDetail = req.summoner.ranked.rankedDetail.find(rankedData => rankedData.queueType === 'RANKED_SOLO_5x5');
        flexDetail = req.summoner.ranked.rankedDetail.find(rankedData => rankedData.queueType === 'RANKED_FLEX_SR');
    }
    let soloRank, flexRank;
    if(soloDetail){
        soloRank = `${soloDetail.tier} ${soloDetail.rank}`;
    }
    if(flexDetail){
        flexRank = `${flexDetail.tier} ${flexDetail.rank}`;
    }
    return res.status(200).json({
        region: req.summoner.region,
        name: req.summoner.name,
        level: req.summoner.summonerLevel,
        soloRank,
        flexRank
    })
}

const express = require('express');
const router = express.Router();

const summoner = require('../services/summoner');
const ranked = require('../services/ranked');

router.get('/detail', summoner.summonerParser, ranked.rankedParser, getPlayerDetail)

module.exports.router = router;