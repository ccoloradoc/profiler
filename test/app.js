const config = require('./config/index');
const ProfileFactory = require('../lib/services/profile-factory');
const profiler = new ProfileFactory(config);

console.log('Storage: ', profiler.storage.getPath());

profiler.fetchProfile()
  .then((profile) => {
    console.log('Profile:', profile)
  });
