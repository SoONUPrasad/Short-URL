const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {connectDB} = require("./db/config");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth.middleware");
const URL = require("./models/url.model");

const urlRoute = require("./routes/urlRoutes");
const staticRoute = require("./routes/staticRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();
const PORT = 8001;

// connectToMongoDB(process.env.MONGODB ?? "mongodb://127.0.0.1:27017/short-url").then(() =>
//   console.log("Mongodb connected")
// );

connectDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server is running on port ${'http://localhost:' + PORT}`));
