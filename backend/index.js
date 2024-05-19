const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
const cors = require("cors") //cross-origin resource sharing
const axios = require('axios')
const url = require('url')
var app = express();
var resdata = []

var email = ""

const path = require('path')
const PORT = process.env.PORT || 5010;
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
//app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.CHAT_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function responseGenerator (input) {
    let inputMessage = input
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: inputMessage,
        max_tokens: 1000,
    });
    // console.log(completion.data.choices[0].text);
    // getReturnMessage(completion.data.choices[0].text)
    return completion.data.choices[0].text
}

app.post('/response', async (req, res) => {
	let txt = req.body.textString
    response = (await responseGenerator(txt))

	res.json(response)
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});

app.use((req, res) => {
    res.status(404);
});