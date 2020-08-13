const axios = require('axios');

const geocode = async area => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    area
  )}.json?access_token=${process.env.MAPBOX_API_KEY}&limit=1`;

  try {
    const { data } = await axios.get(url);
    if (data.message || data.features.length === 0) {
      return '';
    }
    const { center, context } = data.features[0];
    return {
      coords: center,
      state: context[2].text,
      country: context[3].text,
    };
  } catch (error) {
    throw new Error('Something went wrong');
  }
};

module.exports = geocode;
