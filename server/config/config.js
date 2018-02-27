const config = require('./config.json');

const prepareEnvironment = (() => {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'development' || env === 'test') {
    Object.keys(config[env]).forEach(key => process.env[key] = config[env][key]);
  }
  return env;
})();
module.exports = {
  prepareEnvironment
};