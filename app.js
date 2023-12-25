const express = require("express");
const app = express();
const Url = require("./models/url.model");
const { connectDB } = require("./db/config");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();
app.use("/api/url", require("./routes/urlRoutes"));

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const entry = await Url.findByIdAndUpdate({ 
    shortUrl: id 
},
  {
      $push: { visitHistory: { timestamp: Date.now() } },
  });
  res.redirect(entry.redirectURL);
});

module.exports = app;
