'use strict';
var shortid = require('shortid');
var config = require('./config.json')
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var geolib = require('geolib');
var storage = require('./static/js/storage.js')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  {name: 'host', alias: 'h', type: String, multiple: true},
  {name: 'step', alias: 's', type: Number, multiple: true},
]


class App {
  constructor(isElectronApp)
  {
    this.isElectronApp = isElectronApp;
    this.express = express();
    this.express.use(bodyParser.json())
    this.express.use('/', this.routes());


    
    this.maps = [];
    if(!isElectronApp) {
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
      for(let i in options.host) {
        let map = {
          host: options.host[i],
          steps: options.step[i],
          location: null,
        }
        this.maps.push(map);
      }
      this.socket = require('socket.io-client')(config.hostUrl + '/desktop');
      this.socketEvents();
    } else {
      storage.get('desktopClientId')
      .then((desktopClientId) =>
      {
        if(typeof desktopClientId === 'string') {
          this.desktopClientId = desktopClientId;
        }
        this.socket = require('socket.io-client')(config.hostUrl + '/desktop');
        this.socketEvents();
      })
    }
    this.express.listen(config.port);
  }

  routes()
  {
    var router = express.Router();
    router.post('/', (req, res) => {
      if(this.desktopClientId && this.socket.connected) {
        Emitter.emit('pokemon');
        this.socket.emit('pokemon', {
          desktopClientId: this.desktopClientId,
          oldDesktopClientId: this.oldDesktopClientId,
          pokemon: req.body.message || null,
        });
      }
      res.end('ok');
    });
    return router;
  }

  socketEvents()
  {
    this.socket.on('desktop connected', (data) =>
    {
      if(this.isElectronApp) {
        if(!this.desktopClientId) {
          this.desktopClientId = data.desktopClientId;
          storage.set('desktopClientId', data.desktopClientId);
        } else {
          this.oldDesktopClientId = data.desktopClientId
        }
        var payload = {desktopClientId: this.desktopClientId};
        require('./static/js/Emitter.js').emit('desktop connected', payload);
      } else {
          if(this.desktopClientId) {
            this.oldDesktopClientId = this.desktopClientId;
          }
          this.desktopClientId = data.desktopClientId;
      }
      console.log('Connected to server. Your ClientId is: ' + this.desktopClientId);
    })
    this.socket.on('location update', (data) =>
    {
      console.log('Received location update.')
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
      if(this.isElectronApp) {
        Emitter.emit('map error', map);
      }
    } else {
      console.log('Updated map location. Status Code: ' + res.statusCode);
    }
  })
}




module.exports = App
