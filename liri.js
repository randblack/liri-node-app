require("dotenv").config();
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var request = process.argv[2];
var value = process.argv[3];

if (request == "movie-this" && value == undefined) {
  value = "Mr. Nobody"
}

if (request == "spotify-this-song" && value == undefined) {
  value = "The Sign Ace of Base"
}

if (request == "do-what-it-says") {
  fs.readFile('./random.txt', "utf8", function read(err, data) {
    var randomArray = data.split(":");
    var randomPosition = Math.floor(Math.random() * (29 - 0 + 0)) + 0;
    var randomSelection = randomArray[randomPosition];
    var selectionArray = randomSelection.split(",");
    request = selectionArray[0];
    value = selectionArray[1];
    if (err) {
      throw err;
    }
    if (request == "spotify-this-song") {
      spotifyThisSong();
    }
    if (request == "movie-this") {
      movieThis();
    }
    if (request == "concert-this") {
      concertThis();
    }
  });
}

if (request == "movie-this") {
  movieThis();
}

if (request == "spotify-this-song") {
  spotifyThisSong();
}

if (request == "concert-this") {
  concertThis();
}

function spotifyThisSong() {
  spotify.search({ type: 'track', query: value }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
    console.log('Song Title: ' + data.tracks.items[0].name);
    console.log('Preview: ' + data.tracks.items[0].preview_url);
    console.log('Album: ' + data.tracks.items[0].album.name);
    fs.appendFile('log.txt', '\n\n\nSpotify Song: \n\nArtist: ' + data.tracks.items[0].album.artists[0].name + '\nSong Title: ' + data.tracks.items[0].name + '\nPreview: ' + data.tracks.items[0].preview_url + '\nAlbum: ' + data.tracks.items[0].album.name, function (err) {
      if (err) throw err;
    });
  });
}

function movieThis() {
  axios.get('http://www.omdbapi.com/?t=' + value + '&plot=short&apikey=' + keys.omdb.key)
    .then(function (response) {
      console.log('Title: ' + response.data.Title);
      console.log('Year Released: ' + response.data.Year);
      console.log('IMDB Rating: ' + response.data.Ratings[0].Value);
      console.log('Rotton Tomatoes Rating: ' + response.data.Ratings[1].Value);
      console.log('Country: ' + response.data.Country);
      console.log('Language: ' + response.data.Language);
      console.log('Plot: ' + response.data.Plot);
      console.log('Cast: ' + response.data.Actors);
      fs.appendFile('log.txt', '\n\n\nMovie: \n\nTitle: ' + response.data.Title + '\nYear: ' + response.data.Year + '\nIMDB Rating: ' + response.data.Ratings[0].Value + '\nRotton Tomatoes Rating: ' + response.data.Ratings[1].Value + '\nCountry: ' + response.data.Country + '\nLanguage: ' + response.data.Language + '\nPlot: ' + response.data.Plot + '\nCast: ' + response.data.Actors, function (err) {
        if (err) throw err;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function concertThis() {
  axios.get('https://rest.bandsintown.com/artists/' + value + '/events?app_id=' + keys.bandsintown.id)
    .then(function (response) {
      console.log(response.data[0].lineup[0] + " will be performing at " +
        response.data[0].venue.name + " in " +
        response.data[0].venue.city + ", " +
        response.data[0].venue.region + " on " +
        moment(response.data[0].datetime).format('MMMM Do YYYY, h:mm:ss a'));
      fs.appendFile('log.txt', '\n\n\nConcert: \n\nArtist: ' + response.data[0].lineup[0] + '\nVelue: ' + response.data[0].venue.name + '\nCity: ' + response.data[0].venue.city + '\nState: ' + response.data[0].venue.region + '\nTime: ' + moment(response.data[0].datetime).format('MMMM Do YYYY, h:mm:ss a'), function (err) {
        if (err) throw err;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
