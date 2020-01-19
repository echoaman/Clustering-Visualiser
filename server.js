const express = require("express")
const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("server started")
});

app.use(express.static(__dirname + '/public'))
// app.use("/public", express.static(__dirname + "/public"))

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/index.html")
})
