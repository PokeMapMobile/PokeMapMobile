'use strict';
var shortid = require('shortid');
var config = require('./config.json')
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var geolib = require('geolib');
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  {name: 'host', alias: 'h', type: String, multiple: true},
  {name: 'step', alias: 's', type: Number, multiple: true},
]

var options = commandLineArgs(optionDefinitions)

if(options.host.length != options.step.length) {
  throw new Error('Error: Command line arguments incorrect. Number of hosts is not the same as the number of step limits provided.');
}

for(let i in options.host) {
  if(options.host[i].charAt(0) === ':') {
    options.host[i] = 'http://localhost' + options.host[i];
  }
  if(options.host[i] === config.hostUrl) {
    throw new Error('Error: A Map\'s url is the same url as this application.');
  }
}

class App {
  constructor()
  {
    this.express = express();
    this.express.use(bodyParser.json())
    this.express.use('/', this.routes());
    this.socket = require('socket.io-client')(config.hostUrl + '/desktop');
    this.socketEvents();

    this.maps = [];
    for(let i in options.host) {
      let map = {
        host: options.host[i],
        steps: options.step[i],
        location: null,
      }
      this.maps.push(map);
    }
    console.log(this.maps);
    this.express.listen(3001);
  }

  routes()
  {
    var router = express.Router();
    router.post('/', (req, res) => {
      if(this.desktopClientId && this.socket.connected) {
        this.socket.emit('pokemon', {
          desktopClientId: this.desktopClientId,
          pokemon: req.body.message || null,
        });
      }
    });
    return router;
  }

  socketEvents()
  {
    this.socket.on('desktop connected', (data) =>
    {
      this.desktopClientId = data.desktopClientId;
      console.log('Connected to server. Your ClientId is: ' + this.desktopClientId);
    })
    this.socket.on('location update', (data) =>
    {
      var newLocation = {
        latitude: data.lat,
        longitude: data.lng,
      };
      this.refreshMaps(newLocation);
    })
  }

  refreshMaps(newLocation)
  {
    for(let i in this.maps) {
      let map = this.maps[i];
      if(!map.location  || locationOutsideMapRange(map, newLocation)) {
        map.location = newLocation;
        updateMap(map);
      }
    }
  }

}

function locationOutsideMapRange(map, userLocation)
{
  var userDistFromMapCenter = geolib.getDistance(map.location, userLocation, 1, 3);
  var mapRadius = map.steps * config.metersPerStep;
  return userDistFromMapCenter >= mapRadius * config.minUserLocDiff;
}

function updateMap(map)
{
  console.log('Updating map with host: ' + map.host);
  var reqOptions = {
    url: map.host + config.nextLocEndpoint, 
    method: 'POST',
    form: {
      lat: map.location.latitude,
      lon: map.location.longitude,
    },
  }
  request(reqOptions, (err, res, body) =>
  {
    if(err) {
      console.log('Error updating map:');
      console.log(err);
    } else {
      console.log('Updated map location. Status Code: ' + res.statusCode);
    }
  })
}



module.exports = new App()
