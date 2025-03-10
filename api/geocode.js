const axios = require('axios');

module.exports = async (req, res) => {
  const { address, key } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
};