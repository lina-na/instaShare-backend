require('dotenv').load({path: process.env.DOTENV || '.env'});
const config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: process.env.DB_CONNECT || "mongodb://localhost:27017",

    // TODO Change this to your database name:
    databaseName: process.env.DB_NAME || "YOURDATABASENAME",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout up to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout up to 1 hour
    }
  },

  // The migrations dir can be a relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The MongoDB collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog"
};
module.exports = config;
