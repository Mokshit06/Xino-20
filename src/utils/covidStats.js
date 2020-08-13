const axios = require('axios');

const getCovidStats = async ({ country, state }) => {
  try {
    const {
      data: {
        data: {
          countryState: { Active },
        },
      },
    } = await axios.post('https://corona.azure-api.net/graphql', {
      query: `{
          countryState(country: "${country}", state: "${state}"){
            Active
          }
        }`,
    });

    return Active;
  } catch (error) {
    console.log(error);
    throw new Error('Cant get stats');
  }
};

module.exports = getCovidStats;
