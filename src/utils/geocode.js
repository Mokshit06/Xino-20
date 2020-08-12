const axios = require('axios');

const geocode = async area => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    area
  )}.json?access_token=pk.eyJ1IjoibW9rc2hpdDA2IiwiYSI6ImNrYW1qamMybDA0eW0yeXFvMnB5dW1sMmUifQ.T7tkxjaaE6hY6m4mV5GEpQ&limit=1`;

  try {
    const { data } = await axios.get(url);
    if (data.message || data.features.length === 0) {
      return '';
    }
    const {
      center: [longitude, latitude],
    } = data.features[0];
    return [longitude, latitude];
  } catch (error) {
    throw new Error('Something went wrong');
  }
};

module.exports = geocode;
