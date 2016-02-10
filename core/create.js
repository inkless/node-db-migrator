var moment = require('moment');

module.exports = function(param) {
  console.log('creating ' + moment().format('YYYYMMDDHHmmssSSS') + '_' + param);
};
