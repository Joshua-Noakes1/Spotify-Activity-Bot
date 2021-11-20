require("dotenv").config();
const path = require("path");
const { saveJSON } = require("../bin/readWrite");

// take env to config.json

function setupConfig() {
  // write config file
  const config = {
    movieDB: process.env.movieDB,
    tautulliName: process.env.tautulliName,
    twitter: {
      useTwitter: process.env.useTwitter === "true" ? true : false,
      user: process.env.twitterUser,
      APIKey: process.env.twitterAPIKey,
      APISecret: process.env.twitterAPISecret,
      accessToken: process.env.twitterAccessToken,
      accessSecret: process.env.twitterAccessSecret,
    },
    thirdparty: {
      useThirdparty: process.env.useThirdparty === "true" ? true : false,
      cloudinary: {
        cloudName: process.env.cloudinaryCloudName,
        APIkey: process.env.cloudinaryAPIKey,
        APISecret: process.env.cloudinaryAPISecret,
      },
    },
    dev: false,
  };

  saveJSON(path.join(__dirname, "../", "config", "config.json"), config, true);
}

module.exports = { setupConfig };
