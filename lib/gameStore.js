'use strict';

const createGame = require('tbq').createGame;
const data = require('../data/sonaquest');
const config = require('config');


function GameStore() {
  var games = {};

  function loadGameForSession(sessionId) {
    if (!games.hasOwnProperty(sessionId)) {
      games[sessionId] = createGame(data, config.get('locale'))
    }
    return games[sessionId];
  }

  return {
    load: loadGameForSession
  }
}

module.exports = GameStore();
