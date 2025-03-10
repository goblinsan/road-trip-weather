const axios = require('axios');

module.exports = async (req, res) => {
  const { lat, lon, units, appid } = req.query;

  try {
    const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat,
        lon,
        units,
        appid,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
};