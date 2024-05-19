const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
const cors = require("cors") //cross-origin resource sharing
const axios = require('axios')
const url = require('url')
var app = express();
var aidata = ["Hmph, it's not like I care or anything, but you've been staring at your screen for way too long. Go outside and touch some grass or something, okay? It's not like I think you need it or anything...",
"Ugh, are you still here? It's not like I care or anything, but maybe you should go outside and touch some grass. Not that I think you need a break or anything, but fresh air might do you some good...",
"Why don't you go outside for a bit? It's not healthy to stay indoors all the time. Go get some fresh air and enjoy the sunshine, okay? You'll feel so much better!",
"You've been inside for too long. Go outside and touch some grass!",
"It's a beautiful day outside. Go get some fresh air!",
"Step away from the screen and enjoy the outdoors for a while.",
"Why don't you take a break and go touch some grass?",
"You've been working hard. Go outside and relax for a bit.",
"Fresh air and sunshine will do you good. Go outside!",
"Take a moment to step outside and enjoy nature.",
"You've been indoors all day. Go out and touch some grass!",
"Give yourself a break and go get some fresh air.",
"You deserve a little outdoor time. Go touch some grass!"]
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
const { randomInt } = require('crypto');
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.CHAT_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function responseGenerator (input) {
    let inputMessage = input
    const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo-16k-0613",
        prompt: inputMessage,
        max_tokens: 1000,
    });
    // console.log(completion.data.choices[0].text);
    // getReturnMessage(completion.data.choices[0].text)
    return completion.data.choices[0].text
}

app.post('/response', async (req, res) => {
	let txt = req.body.textString
   // response = (await responseGenerator(txt))

	res.json(aidata[randomInt(aidata.length)])
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});

app.use((req, res) => {
    res.status(404);
});