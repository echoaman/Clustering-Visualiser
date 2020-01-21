const express = require("express");
const app = express();
const path = require('path');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server started'));

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
