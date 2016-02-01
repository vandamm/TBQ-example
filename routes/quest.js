const router = require('express').Router();
const uuid = require('uuid');
const GameStore = require('../lib/gameStore');

router.post('/', function(req, res, next) {
  const command = req.body ? req.body.command : '';
  const sessionId = req.cookies.session || uuid.v1();
  const game = GameStore.load(sessionId);

  res
    .cookie('session', sessionId)
    .send(game.exec(command))
    .end();
});

module.exports = router;
