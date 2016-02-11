var fs = require('fs');

exports.checkExists = function(path) {
  try {
    fs.statSync(path);
  } catch(e) {
    return false;
  }
  return true;
}
