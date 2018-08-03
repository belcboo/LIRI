//Required packages.
require("dotenv").config();
let keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

//Declaring global variables.

var operation = process.argv[2];
var option1 = process.argv[3];
var storeData = "";
var textFile = "log.txt";
var logval = "";
var separator = "\n--------------------------------------------------------------------------------------------------------------------------------\n"
var date;

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

//OMDB Functionallity.
var omdbLogic = {
  validator: function() { //Checks if user type or not a movie.
    if (option1 === undefined) { //If not sets the option to "Mr Nobody" and then calls the pull function
      option1 = "Mr. Nobody";
      omdbLogic.pull();
    } else { //If there's a movie typed by the user then only calls the pull function.
      omdbLogic.pull();
    }
  },
  pull: function() {
    logval += "movie-this " + option1 + "\n"
    request("http://www.omdbapi.com/?t=" + option1 + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

      // If the request is successful (i.e. if the response status code is 200)
      if (!error && response.statusCode === 200) {
        storeData = JSON.parse(body);
        omdbLogic.print();
      }
    });
  },
  print: function() {
    console.log("Title: " + storeData.Title,
      "\nYear: " + storeData.Year,
      "\nIMDB: " + storeData.imdbRating,
      "\nRating Roten Tomatoes: " + storeData.Ratings[1].Value,
      "\nCountry: " + storeData.Country,
      "\nLanguage: " + storeData.Language,
      "\nActors: " + storeData.Actors,
      "\nPlot: " + storeData.Plot);
    omdbLogic.log();
  },

  log: function() {
    // date = new Date();
    // console.log(date);
    fs.appendFile(textFile, logval, function(err) {});
  },
}

var spotifyLogic = {
  validator: function(){
    if(option1 === undefined){
      option1 = "All the Small Things"
      spotifyLogic.search();
    } else{
      spotifyLogic.search();
    }
  },
  search: function() {
    spotify.search({
        type: 'track',
        query: option1
      })
      .then(function(response) {
        // console.log(response);
        // console.log(response.tracks.items[0]);
        storeData = response.tracks;
        console.log()
        spotifyLogic.print();
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  print: function() {
    for (var x = 0; x < 20; x++) {
      console.log(separator + "Songs Information #" + (x + 1),
        "\nName: " + storeData.items[x].name,
        "\nArtist: " + storeData.items[x].artists[0].name,
        "\nAlbum: " + storeData.items[x].album.name,
        "\nPreview URL: " + storeData.items[x].preview_url,
        separator);
    };
  }
};

var twitterLogic = {
  validator: function(){
    if (option1 === undefined){
      option1 = 'MeFjGarcia';
      twitterLogic.search();
    } else{
      twitterLogic.search();
    }
  },
  search: function() {
    client.get('search/tweets', {q: option1}, function(error, tweets, response) {
      storeData = tweets;
      twitterLogic.print();
    });
  },

  print: function() {
    console.log("This are your lastest tweets.");
    for(var i =0 in storeData.statuses){
      console.log(separator + storeData.statuses[i].text + separator);
    }
  }
}

switch (operation) {
  case 'movie-this':
    omdbLogic.validator();
    break;
  case 'spotify':
    spotifyLogic.validator();
    break;
  case 'my-tweets':
    twitterLogic.validator();
    break;
}
