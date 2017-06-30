var path = require('path');
var fs = require('fs');


class Storage {
  constructor(config) {
    try {
      if(!config || config.STORAGE_PATH === undefined || config.ROOT === undefined) {
        throw Error("Unable to find storage path");
      } else {
        this.STORAGE_PATH = path.join(config.ROOT, config.STORAGE_PATH);
      }
    } catch(e) {
      console.log(e);
    }
  }

  getPath() {
    return this.STORAGE_PATH;
  }

  store(name, data) {
    fs.writeFile(this.STORAGE_PATH + '/' + name, data, 'binary', function(err) {
      console.log(err);
    });
  }

  storeb64(name, b64i) {
    var base64Data = b64i.replace(/^data:image\/png;base64,/, '');

    fs.writeFile(this.STORAGE_PATH + '/' + name, base64Data, 'base64', function(err) {
      console.log(err);
    });
  }
}

module.exports = Storage;
