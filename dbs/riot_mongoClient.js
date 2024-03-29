const MongoClient = require("mongodb").MongoClient;
let db;

const getDb = async () => {
  if (!db) {
    try {
      const client = await MongoClient.connect(process.env.MONGOURI, {
        useUnifiedTopology: true,
      });
      db = client.db(process.env.RIOTDB);
    } catch (err) {
      console.error("error connecting to the mongoDB");
      throw err;
    }
  }
  return db;
};

module.exports = getDb;
