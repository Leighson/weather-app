

const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = 3000;

require('dotenv').config()

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const appID = process.env.OPENWEATHER_APPID;
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'
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

    https.get(baseURL + `q=${city}&units=${unit}&appid=${appID}`, (response) => {
        console.log(response.statusCode);

        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;

            res.send(`The temperature in ${city} is ${temp} ${unitSymbol}. Description: ${desc}.`);

            console.log(temp);
        })
    });

});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});