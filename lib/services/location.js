const fs = require('fs');

class Location {
  constructor() {
    this.rootDir = './location/countries';
    this.countries = ['mexico', 'belize', 'brazil', 'colombia', 'ecuador', 'el-salvador', 'honduras'];
  }

  _rand(num) {
    return Math.floor(Math.random() * num);
  }

  loadCountry(country) {
    // Cache!!!s
    return new Promise((resolve, reject) => {
      fs.readFile(`${this.rootDir}/${country}.json`, 'utf8', function (err, data) {
        if (err) reject(err);

        resolve({
         [country]: JSON.parse(data)
        });
      });
    });
  }

  formatCountries(result) {
    let hash = {};
    result.forEach((item) => {
      Object.assign(hash, item);
    })
    return hash;
  }

  setup() {
    let promises = [];
    this.countries.forEach((country) => {
      promises.push(this.loadCountry(country));
    });

    return Promise
      .all(promises)
      .then(this.formatCountries);
  }

  fetchLocation() {
    const country = this.countries[this._rand(7)];
    return new Promise((resolve, reject) => {
      this.loadCountry(country).then((result) => {
        const list = result[country];
        const state = list[this._rand(list.length)].name;
        resolve({ country, state });
      });
    });
  }
}

module.exports = Location;
