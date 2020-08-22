const summonerByNameUrl = (region, summonerName) => `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;
const rankedDetailsUrl = (region, summonerId) => `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;

module.exports = {
    summonerByNameUrl,
    rankedDetailsUrl
}