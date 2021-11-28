const express = require("express");
const mongoose = require("mongoose");
const app = express();

const connect = () => {
    return mongoose.connect("mongodb+srv://remonsingh:remon123@cluster0.ylca6.mongodb.net/entertainment")

}
const userSchema = new mongoose.Schema({
  movie_name : String,
  movie_genre : String,
  production_year : Number,
  budget : Number,
});

const movie = mongoose.model("movie", userSchema);

app.get("/api/name/:name", async (req, res) => {
     console.log(req.params.name)
  const data = await movie.find({ movie_name: req.params.name }).lean().exec();
  res.send(data);
});

app.get("/api/notname/:notname", async (req, res) => {
  const data = await movie
    .find({ movie_name: { $not: { $eq: req.params.notname } } })
    .lean()
    .exec();
  res.send(data);
});
app.get("/api/budgets/max=:max/min=:min", async (req, res) => {
  let data = await movie
    .find({
      budget: { $gte: req.params.min, $lte: req.params.max },
    })
    .lean()
    .exec();
  res.send(data);
  console.log(data.length);
});

let skip = 0;
app.get("/api/year/max=:max/min=:min", async (req, res) => {
  let data = await movie
    .find({
      production_year: { $gte: req.params.min, $lte: req.params.max },
    })
    .sort({ production_year: -1 })
    .skip(skip)
    .limit(6)
    .lean()
    .exec();
  res.send(data);
  console.log(data.length);
  skip = skip + 6;
});

const start = async () => {
  await connect();
  app.listen(3445, () => {
    console.log("Server Started");
  });
};

start();