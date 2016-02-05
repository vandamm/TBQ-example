'use strict';

const readline = require('readline');
const config = require('config');

const TBQ = require('tbq');
const data = require('./data/sonaquest');

const quest = TBQ.createGame(data, config.get('locale'));

const rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('>> ');

console.log(quest.exec().text);
rl.prompt();

rl.on('line', function(line) {
  const questResult = quest.exec(line);

  if (questResult.text === null) {
    console.log(config.get('text.help'));
  } else {
    console.log('\n' + questResult.text);
  }

  if (questResult.end === true) {
    process.exit();
  } else {
    rl.prompt();
  }

});
