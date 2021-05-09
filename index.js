require('dotenv').config();
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_Secret_Key,
    access_token_key: process.env.Access_Token,
    access_token_secret: process.env.Access_Token_Secret
});

/*
client.post('statuses/update', {status: 'NodeJS Bot Test'}, function(error, tweet, response) {
    if (!error) {
      console.log(tweet);
    }
  }); */