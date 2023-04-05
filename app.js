const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", (req, res) => {
    console.log(req.body);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});