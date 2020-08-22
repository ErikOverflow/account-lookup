const config = require("../config");
const axios = require("axios");
const getDb = require("../dbs/riot_mongoClient");

const axiosOptions = {
  headers: {
    "X-Riot-Token": process.env.RIOTKEY,
  },
};

const getRankedDetail = async (region, summonerId) => {
  const db = await getDb();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const query = {
    summonerId: summonerId,
    region: new RegExp(`^${region}$`, "i"),
    lastModified: { $gte: yesterday },
  };
  const findOptions = { projection: { _id: 0 } };
  let rankedDoc;
  try {
    rankedDoc = await db.collection("ranked").findOne(query, findOptions);
  } catch (err) {
    throw err;
  }
  if (rankedDoc) {
    return rankedDoc;
  }
  delete query.lastModified;
  let res;
  //Get new summoner data from Riot
  try {
    res = await axios.get(
      config.rankedDetailsUrl(region, summonerId),
      axiosOptions
    );
  } catch (err) {
    throw err;
  }
  let rankedData = {
      summonerId,
      region, 
      rankedDetail: res.data
  }

  //Upsert the document to the DB
  const update = {
    $set: rankedData,
    $currentDate: { lastModified: true },
  };
  const updateOptions = { upsert: true };
  await db.collection("ranked").updateOne(query, update, updateOptions);
  rankedDoc = await db.collection("ranked").findOne(query, findOptions);
  return rankedDoc;
};

const lookupRankedDetail = async (req, res) => {
    req.summoner.ranked = await getRankedDetail(req.query.region, req.summoner.id);
    return res.status(200).json(req.summoner.ranked);
}

module.exports = {
    lookupRankedDetail
}