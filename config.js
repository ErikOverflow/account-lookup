const summonerByNameUrl = (region, summonerName) => `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;

module.exports = {
    summonerByNameUrl
}