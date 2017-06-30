const axios = require('axios');
const crypto = require('crypto');
const Location = require('./location');
const Storage = require('./storage');

class ProfileFactory {
  constructor(config) {
      this.location = new Location(config.location);
      this.storage = new Storage(config.storage)

      this.buildProfile = this.buildProfile.bind(this);
      this.downloadProfilePic = this.downloadProfilePic.bind(this);
      this.defineStatus = this.defineStatus.bind(this);
      this.fetchLocation = this.fetchLocation.bind(this);
  }

  buildProfile(response) {
    const profile = response.data.results[0];
    return {
      firstName: profile.name.first,
      alias: profile.name.first,
      lastName: profile.name.last,
      gender: profile.gender,
      birthdate: new Date(profile.dob),
      picture: profile.picture.large
    };
  }

  downloadProfilePic(profile) {
    const _self = this;
    return new Promise((resolve, reject) => {
      axios.get(profile.picture, { responseType: 'arraybuffer' })
      .then((response) => {
        const buffer = new Buffer(response.data, 'binary');
        profile.id = crypto.randomBytes(20).toString('hex');
        _self.storage.store(`${profile.id}.jpg`, buffer);
        resolve(profile);
      });
    });
  }

  defineStatus(profile) {
    profile.status = Math.random() > .5 ? 'migrante' : 'vistante';
    return profile;
  }

  fetchLocation(profile) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self.location.fetchLocation()
      .then((loc) => {
        Object.assign(profile, loc);
        resolve(profile);
      })
    });
  }

  fetchProfile() {
    return new Promise((resolve, reject) => {
      axios.get('https://randomuser.me/api')
      .then(this.buildProfile)
      .then(this.downloadProfilePic)
      .then(this.defineStatus)
      .then(this.fetchLocation)
      .then(resolve);
    });
  }
}

module.exports = ProfileFactory;