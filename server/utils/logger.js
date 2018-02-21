const fs = require('fs');

module.exports = {
  logger: {
    info: (log) => fs.appendFileSync('server.log', `${new Date().toString()}: ${log}\n`)
  }
};