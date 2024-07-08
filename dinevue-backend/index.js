const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multiparty = require("connect-multiparty");
const cloudinary = require("cloudinary").v2;

dotenv.config();

const app = express();

const corsPolicy = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

app.use(multiparty());

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

cloudinary.config({
  cloud_name: 'dm0bzmewu',
  api_key: '299691132911476',
  api_secret: 'k-mb7lb2zb8gpxvIiwUKvdaygO4',
});

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello");
});

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/restaurant', require('./routes/restaurantRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
