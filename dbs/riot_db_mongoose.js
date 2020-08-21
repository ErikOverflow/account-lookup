const mongoose = require('mongoose');
const connection_uri = process.env.RIOTDB
mongoose.connect(connection_uri, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = exports = mongoose;