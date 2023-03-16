var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
var config = require("config");
var { emailSend } = require("./email/email");

var indexRouter = require("./routes/index");
var apiAdminRouter = require("./routes/api/admin");
var apiUserRouter = require("./routes/api/user");
var apiQuestionRouter = require("./routes/api/question");
var apiQuestionSpanishRouter = require("./routes/api/questionSpanish");
var apiAnswerRouter = require("./routes/api/answer");
var apiAnswerSpanishRouter = require("./routes/api/answerSpanish");
var apiPasswordReserRouter = require("./routes/api/passwordReset");
var apiCurrentQuestionRouter = require("./routes/api/currentQuestion");
var apiCurrentQuestionSpanishRouter = require("./routes/api/currentQuestionSpanish");
var apiEvents = require("./routes/api/events");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
	cors({
		origin: "*",

		methods: ["GET", "POST"],

		allowedHeaders: ["Content-Type"],
	})
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/admin", apiAdminRouter);
app.use("/user", apiUserRouter);
app.use("/question", apiQuestionRouter);
app.use("/question-spanish", apiQuestionSpanishRouter);
app.use("/answers", apiAnswerRouter);
app.use("/answers-spanish", apiAnswerSpanishRouter);
app.use("/password-reset", apiPasswordReserRouter);
app.use("/current-question", apiCurrentQuestionRouter);
app.use("/current-question-spanish", apiCurrentQuestionSpanishRouter);
app.use("/events", apiEvents);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

emailSend();

mongoose
	.connect(
		`mongodb+srv://${config.get("username")}:${config.get(
			"passwordMongoDb"
		)}@${config.get(
			"host"
		)}/screeningSystem?authSource=admin&replicaSet=db-mongodb-nyc3-49774&tls=true&tlsCAFile=certificate/ca-certificate.crt`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("Connection Established");
	})
	.catch((err) => {
		console.log(err);
		console.log("Connection Not Established");
	});

module.exports = app;
