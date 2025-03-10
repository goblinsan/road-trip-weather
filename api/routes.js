const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const response = await axios.post('https://routes.googleapis.com/directions/v2:computeRoutes', req.body, {
      params: {
        key: req.query.key,
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
};