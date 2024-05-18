const express = require('express');
const app = express();
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors') //cross-origin resource sharing
const axios = require('axios')
const url = require('url')
const latexgen = require('./latex_gen')

const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const bodyParser = require('body-parser');
const path = require('path')

const PORT = process.env.PORT || 5010;

app.use('/static/', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

function hashCode(str) {
    let hash = 0;
    for (var i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

app.use(cors({
    origin: '*' // change to webapp later
}));


const halfHr = 1000 * 60 * 30;
const PRODUCTION = !true;

if (PRODUCTION) {
app.use(function(request, response, next) {

    if (request.headers['x-forwarded-proto'] !== 'https') {
       return response.redirect("https://" + request.headers.host + request.url);
    }

    next();
})
}

async function get_from_backend(eind, vind, aind, pind, splm, red) {
    /*
    let eindex = req.body.ind;
    let vindex = req.body.vind;
    let aindex = req.body.aind
    let pindex = req.body.pind

    // Splice up to?
    let splMax = req.body.smax;

    // Redact names to protect people?
    let redact = req.body.redact;
    */


    var results = null;
    // arguments to send to api
    const newEntry = {
        "ind": eind,
        "vind": vind,
        "aind": aind,
        "pind": pind,
        "smax": splm,
        "redact": red,
    }
    
    await axios.post('https://portfolio-backend-1-049baa667f08.herokuapp.com/portfoliodata', newEntry).then(apiRes => {
        results = (apiRes.data);
    }).catch(error => {
        console.error('Error: ', error)
    });

    return results;
}

app.get('/resume', async (req, res) => {
    const data = await get_from_backend(0,0,0,1,3,false);
    
    latexgen.generateLatex(data, latexgen.latexTemp, res);
});

app.get('/cover', async (req, res) => {
    const data = await get_from_backend(0,0,0,1,3,false);
    
    const date = new Date();  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'long' });
    const day     = date.getUTCDate();
    const year    = date.getUTCFullYear();       
    console.log(month);
    
    const inputD = {"profile":data.profile,
                    "datetime": month + ' ' + day + ' ' + year,
                    'address': `201 - 1375 McLean Drive
                    Vancouver, British Columbia, Canada
                    V5L 3N7`,
                    "addresse": "John Smith",
                    "contents": `As a person who is fascinated by the possibilities of emerging technologies, I believe that by joining your team, I can continue to expand my skillset and produce software that everyone would enjoy which helps connect people together and solve real world problems. I believe that my experiences of developing data visualization applications for the Department of Education at SFU and building a 3D augmented reality application, excellent collaboration and teamwork and self motivation with projects would be beneficial for this position.
                    Firstly, I have developed two web applications for the Department of Education at SFU that take education spreadsheet data from a server and convert it from comma separated values into a interactive data visualization app. All of the functionality is done at the front-end. It allows the user to interactively zoom in and out of the map and look around in real-time. Users can filter through options such as the Author, location, region, funder and other attributes. One version also displays information in the form of cards on the left side and allows them to view pictures and descriptions about the study. The other version provides a data plot with tooltips to identify multiple publications. This provides researchers the ability to see research in a whole different way, as opposed to looking through spreadsheets.
                    In addition, I was also part of a team for the Department of Education at SFU that developed a Augmented Reality web app for Science World for the purposes of enhancing bee lifecycle education. I was responsible for providing high quality 3D models for the app and to find a AR solution that works for all platforms by the deadline. Through biweekly meetings with my teammates, I refined the high quality 3D bee models to meet the design specifications and we used Zappar, an AR solution that works directly in the web browser. Additionally, in the new update, I have also refined the touch controls to be more responsive and to support multitouch and physics-based movement. This provides Science World with a 3D interactive bee simulation that is much more engaging than traditional lectures and videos.
                    I am eager to provide the teamwork skills, programming skills and aptitude needed to support this research project and ensure success in this position. By providing you with my skills and experiences, I can learn more string analysis and how I can apply my design and computing experience to support your endeavors and how they can be used to solve real world problems. I also ensure that any projects that I am entrusted to work become successful. I appreciate you taking the time to review my application and I look forward to an interview with you. 
                    Sincerely,  `
                    }

    latexgen.generateLatex(inputD, latexgen.latexTempCvr, res);
});

app.post('/cover', async (req, res) => {
    const data = await get_from_backend(0,0,0,1,3,false);
    
    const date = new Date();  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'long' });
    const day     = date.getUTCDate();
    const year    = date.getUTCFullYear();       
    console.log("Post mode");
    
    const inputD = {"profile":data.profile,
                    "datetime": month + ' ' + day + ' ' + year,
                    'address': req.body.address,
                    "addresse": req.body.addresse,
                    "contents": req.body.contents
                    }

    latexgen.generateLatex(inputD, latexgen.latexTempCvr, res);
});

app.get('/cover-latex', async (req, res) => {
    const data = await get_from_backend(0,0,0,1,3,false);
    
    const date = new Date();  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'long' });
    const day     = date.getUTCDate();
    const year    = date.getUTCFullYear();       
    console.log(month);
    
    const inputD = {"profile":data.profile,
                    "datetime": month + ' ' + day + ' ' + year,
                    'address': `201 - 1375 McLean Drive
                    Vancouver, British Columbia, Canada
                    V5L 3N7`,
                    "addresse": "John Smith",
                    "contents": `As a person who is fascinated by the possibilities of emerging technologies, I believe that by joining your team, I can continue to expand my skillset and produce software that everyone would enjoy which helps connect people together and solve real world problems. I believe that my experiences of developing data visualization applications for the Department of Education at SFU and building a 3D augmented reality application, excellent collaboration and teamwork and self motivation with projects would be beneficial for this position.
                    Firstly, I have developed two web applications for the Department of Education at SFU that take education spreadsheet data from a server and convert it from comma separated values into a interactive data visualization app. All of the functionality is done at the front-end. It allows the user to interactively zoom in and out of the map and look around in real-time. Users can filter through options such as the Author, location, region, funder and other attributes. One version also displays information in the form of cards on the left side and allows them to view pictures and descriptions about the study. The other version provides a data plot with tooltips to identify multiple publications. This provides researchers the ability to see research in a whole different way, as opposed to looking through spreadsheets.
                    In addition, I was also part of a team for the Department of Education at SFU that developed a Augmented Reality web app for Science World for the purposes of enhancing bee lifecycle education. I was responsible for providing high quality 3D models for the app and to find a AR solution that works for all platforms by the deadline. Through biweekly meetings with my teammates, I refined the high quality 3D bee models to meet the design specifications and we used Zappar, an AR solution that works directly in the web browser. Additionally, in the new update, I have also refined the touch controls to be more responsive and to support multitouch and physics-based movement. This provides Science World with a 3D interactive bee simulation that is much more engaging than traditional lectures and videos.
                    I am eager to provide the teamwork skills, programming skills and aptitude needed to support this research project and ensure success in this position. By providing you with my skills and experiences, I can learn more string analysis and how I can apply my design and computing experience to support your endeavors and how they can be used to solve real world problems. I also ensure that any projects that I am entrusted to work become successful. I appreciate you taking the time to review my application and I look forward to an interview with you. 
                    Sincerely,  `
                    }

    latexgen.generateLatexTest(inputD, latexgen.latexTempCvr, res);
});

app.get('/test', async (req, res) => {
    const data = await get_from_backend(0,0,0,1,3,false);
    console.log(data)
    
    latexgen.generateLatexTest(data, latexgen.latexTemp, res);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // allows us to export app for use in testing
