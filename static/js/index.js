const remote = require('electron').remote;
const {dialog} = require('electron').remote;
var fs = require('fs');
var throwErr = require('./js/throwErr.js')
var Emitter = require('./js/Emitter.js')
var modal = require('./js/modal.js')
var storage = require('./js/storage.js')
var request = require('request');

$(document).ready(() => {
  Emitter.on('desktop connected', (data) =>
  {
    $('#notification-code-alert').removeClass('alert-warning');
    $('#notification-code-alert').addClass('alert-success');
    $('#notification-code-alert').html('<strong>Success!</strong> Your notification code is <strong>' + data.desktopClientId + '</strong>') 
  });
  var App = new (require('../App.js'))(true);

  $('.connect-btn').on('click', (e) =>
  {
    var container = $(e.target).parent().parent();
    var hostUrl = $(container).find('.host-input').val();
    var stepSize = parseInt($(container).find('.step-size-input').val());
    if(!hostUrl || isNaN(stepSize)) {
      console.log(hostUrl)
      console.log('invalid')
      return
    }
    if(hostUrl.charAt(hostUrl.length - 1) == '/') {
      hostUrl = hostUrl.slice(0, hostUrl.length - 1);
    }
    request(hostUrl + '/loc', (err, res, body) =>
    {
      var location = {};
      console.log(err);
      console.log(body);
      if(!err) {
        location = JSON.parse(body);
      }
      if(err || !location.lat || !location.lng) {
        $(e.target).removeClass('btn-primary')
        $(e.target).removeClass('btn-danger')
        $(e.target).addClass('btn-danger')
        $(e.target).text('Failed to Connect');
      } else {
        $(e.target).removeClass('btn-primary')
        $(e.target).removeClass('btn-danger')
        $(e.target).removeClass('btn-success')
        $(e.target).addClass('btn-success')
        $(e.target).text('Connected!');
        var isUnique = true;
        for(var i in App.maps) {
          if(App.maps[i].host == hostUrl && App.maps[i].steps == stepSize) {
            isUnique = false;
          }
        }
        if(isUnique) {
          App.maps.push({
            host: hostUrl,
            steps: stepSize,
            location: null,
          })
        }
      }
    })
  })
});

