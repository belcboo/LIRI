//Required packages.
require("dotenv").config();
let keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

//Declaring global variables.

var operation = process.argv[2];
var option = process.argv[3];
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
    if (option === undefined) { //If not sets the option to "Mr Nobody" and then calls the pull function
      option = "Mr. Nobody";
      omdbLogic.pull();
    } else { //If there's a movie typed by the user then only calls the pull function.
      omdbLogic.pull();
    }
  },
  pull: function() {
    logval += "movie-this " + option + "\n"
    request("http://www.omdbapi.com/?t=" + option + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

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
  validator: function() {
    if (option === undefined) {
      option = "All the Small Things"
      spotifyLogic.search();
    } else {
      spotifyLogic.search();
    }
  },
  search: function() {
    spotify.search({
        type: 'track',
        query: option
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
  validator: function() {
    if (option === undefined) {
      option = 'MeFjGarcia';
      twitterLogic.search();
    } else {
      twitterLogic.search();
    }
  },
  search: function() {
    client.get('search/tweets', {
      q: option
    }, function(error, tweets, response) {
      storeData = tweets;
      twitterLogic.print();
    });
  },

  print: function() {
    console.log("This are your lastest tweets.");
    for (var i = 0 in storeData.statuses) {
      console.log(separator + storeData.statuses[i].text + separator);
    }
  }
}

function random() {
  var randomNo = Math.floor(Math.random() * 6);
  //Check if number is pair or not to define the two numbers to use
  var pairOrNot = randomNo % 2;
  //Assing value to 2 variables used to select random items from random.txt
  if (pairOrNot === 0) {
    var random1 = randomNo;
    var random2 = randomNo + 1;
  } else {
    var random1 = randomNo - 1;
    var random2 = randomNo;
  }

  console.log(randomNo, random1, random2);

  //reading the file and pushin the lines to an array.
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    //Pushing data to Array.
    var dataArr = data.split(",");
    console.log(dataArr);

    //Assingning values from the random.txt to the argvs using the randomn #s generated above.
    operation = dataArr[random1];
    option = dataArr[random2];

    //calls start to re-evaluate the new values asignated and run the program.
    start();
  });
};

function start() {
  switch (operation) {
    case 'movie':
      omdbLogic.validator();
      break;
    case 'spotify':
      spotifyLogic.validator();
      break;
    case 'twitter':
      twitterLogic.validator();
      break;
    default:
      console.log("A random action will be executed...");
      random();
  }
}
//Execute the program for the first time.
start();
