const config = require("../config");
const axios = require("axios");
const getDb = require("../dbs/riot_mongoClient");

const axiosOptions = {
  headers: {
    "X-Riot-Token": process.env.RIOTKEY,
  },
};

const getSummonerByName = async (region, summonerName) => {
  const db = await getDb();
  //Query for the summoner data in MongoDb
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const query = {
    name: new RegExp(`^${summonerName}$`, "i"),
    region,
    lastModified: { $gte: yesterday },
  };
  const findOptions = { projection: { _id: 0 } };
  let summonerDoc
  try {
    summonerDoc = await db
      .collection("summoners")
      .findOne(query, findOptions);
  } catch (err) {
    throw err;
  }
  //Check for up-to-date data within 24 hours
  if (summonerDoc) {
    return summonerDoc;
  }

  delete query.lastModified;
  let res;
  //Get new summoner data from Riot
  try {
    res = await axios.get(
      config.summonerByNameUrl(region, summonerName),
      axiosOptions
    );
  } catch (err) {
    throw err;
  }
  let summonerData = res.data;

  //Upsert the document to the DB
  const update = {
    $set: summonerData,
    $currentDate: { lastModified: true },
  };
  const updateOptions = { upsert: true };
  await db.collection("summoners").updateOne(query, update, updateOptions);
  summonerDoc = await db.collection("summoners").findOne(query, findOptions);

  return summonerDoc;
};

const summonerParser = async (req, res) => {
  if (!req.query.summonerName || !req.query.region) {
    return res.status(403).json({ error: "Missing summoner name or region." });
  }

  const summonerData = await getSummonerByName(
    req.query.region.toLowerCase(),
    req.query.summonerName
  );

  return res.status(200).json(summonerData);
};

module.exports = {
  summonerParser,
};
