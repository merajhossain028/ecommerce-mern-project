const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRoute = require("./router/userRouters");
const seedRouter = require("./router/seedRouter");
const { errorResponse } = require("./controller/responseController");
const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Too many requests, please try again later.",
});

app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/seed", seedRouter);

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "Server is Fine!",
  });
});

//client side error handling
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

//server side error handling
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.statusCode,
    message: err.message,
  });
});

module.exports = app;
