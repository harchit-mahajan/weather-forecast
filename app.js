const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/weather.html");
});

app.post("/", (req, res) => {
    const query = req.body.CityName;
    const appid = "8b7fcd4f32fa1a46bde2837eb2842357";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + appid;

    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const feelsLike = weatherData.main.feels_like;
            const icon = weatherData.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + "</h1>");
            res.write("<img src=" + imgUrl + ">");
            res.send();
            });
        });
    });
    
    app.listen(process.env.PORT || 3000, () => {
        console.log("server running on port 3000");
});