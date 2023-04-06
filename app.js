// obligatory requirements for rendering site, parsing posts, and making requests from API
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config()

// instantiate express modules, static to define file locations & bodyParser to parse user inputs
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

// render home page @ root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// post response on user interaction of weather form @ root
app.post('/', (req, res) => {

    // using bodyParser to parse user input...
    let city = req.body.city;
    let unit = req.body.unit;
    let unitSymbol = '';

    switch (unit) {
        case 'standard':
            unitSymbol = 'K';
            break;
        case 'metric':
            unitSymbol = 'C';
            break;
        case 'imperial':
            unitSymbol = 'F';
            break;
        default:
            break;
    }

    // define API address and authentication
    const appID = process.env.OPENWEATHER_APPID;
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'

    // make HTTPS request to Open Weather API using user input and auth
    https.get(baseURL + `q=${city}&units=${unit}&appid=${appID}`, (response) => {

        // define response upon receipt of API data requested and parse as JSON
        // used Postman to preview data formatting as JSON
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            // see Open Weather API docs to confirm icon code and image assets
            const iconID = weatherData.weather[0].icon;
            const iconURL = `https://openweathermap.org/img/wn/${iconID}@2x.png`;

            // send response based on API data and upon receipt of user's post request
            res.write(`<h1>Description: <img src=${iconURL}> ${desc}.</h1>`);
            res.write(`<p>The temperature in ${city} is ${temp} ${unitSymbol}.</p>`);
            res.send();
        })

        // if (response.statusCode === 200){
        //     window.location.replace(__dirname + '/success.html')
        // } else {
        //     window.location.replace(__dirname + `/failure.html`)
        // }

    });

});

// open server and listen...
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});