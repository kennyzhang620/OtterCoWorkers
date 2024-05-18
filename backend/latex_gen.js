// Powered by psad's database connector

const { default: latex } = require('node-latex');
//const userData = require("./portfolio_data")
function NLToPoints(inStr) {
    const r = /(.+)/g;
  
    const c = [...inStr.matchAll(r)];
    let res = "";
    for (let i = 0; i < c.length; i++) {
      res += "\\item {" + c[i][0] + "}";
    }
  
    return res;
  }

  function NLToPars(inStr) {
    const r = /(.+)/g;
  
    const c = [...inStr.matchAll(r)];
    let res = "";
    for (let i = 0; i < c.length; i++) {
      res += "\\par {" + c[i][0] + "} \\bigskip";
    }
  
    return res;
  }

  function NLToParsNNL(inStr) {
    const r = /(.+)/g;
  
    const c = [...inStr.matchAll(r)];
    let res = "";
    for (let i = 0; i < c.length; i++) {
      res += "\\par {" + c[i][0] + "}";
    }
  
    return res;
  }

function addSectionSkills(userData) {

    var lt = "";
    
    for (var i=0;i<userData.profile.skills.length;i++) {
            lt += `
        \\item {\\textbf{${userData.profile.skills[i].category}:} ${userData.profile.skills[i].metadata}}
        `
    }

    return lt;
}

function addSectionExp(userData) {

    var lt = "";
    
    for (var i=0;i<userData.jobs.length;i++) {
            lt += `
            \\customcventry{${userData.jobs[i].daterange}}{{\\color{black}\\href{${userData.jobs[i].href}}{(${userData.jobs[i].location})}}}{${userData.jobs[i].title},}{}{}{
                {\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]
                ${NLToPoints(userData.jobs[i].description)}
                \\end{itemize}}}
          `
    }

    return lt
}


function addSectionProject(userData) {

    var lt = "";
    
    for (var i=0;i<userData.projects.length;i++) {
            lt += `
            \\customcventry{${userData.projects[i].daterange}}{{\\color{black}(${userData.projects[i].flairs[0].type})}}{${userData.projects[i].name},}{}{}{
                {\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]
                ${NLToPoints(userData.projects[i].res_summary)}
                \\end{itemize}}}
          `
    }

    return lt
}

function latexTemp(userData) {
    const latextmp = `
\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{black}
\\nopagenumbers{}
\\usepackage[utf8]{inputenc}
\\usepackage{ragged2e}
\\usepackage[scale=0.915]{geometry}
\\usepackage{import}
\\usepackage{multicol}
\\usepackage{import}
\\usepackage{enumitem}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb}
\\name{${userData.profile.fname}}{${userData.profile.lname}}
\\newcommand*{\\customcventry}[7][.13em]{
\\begin{tabular}{@{}l}
{\\bfseries #4} \\
{\\itshape #3}
\\end{tabular}
\\hfill
\\begin{tabular}{l@{}}
{\\bfseries #5} \\
{\\itshape #2}
\\end{tabular}
\\ifx&#7&%
\\else{\\
\\begin{minipage}{\\maincolumnwidth}%
\\small#7%
\\end{minipage}}\\fi%
\\par\\addvspace{#1}}
\\begin{document}
\\makecvtitle
\\vspace*{-16mm}
\\begin{center}\\textbf{${userData.profile.description}}\\end{center}
\\begin{center}
\\begin{tabular}{ c c c }
\\faMobile\\enspace ${userData.profile.email} & \\faHome\\enspace ${userData.profile.area} \\\\
\\faLinkedin\\enspace \\color{black} \\href{${userData.profile.linkedin}}{${userData.profile.linkedin_short}} &
\\faGithub\\enspace \\color{black} \\href{${userData.profile.github}}{${userData.profile.github_short}}
\\end{tabular}
\\end{center}

\\section{Skills}
{\\begin{itemize}[label=\\textbullet]
${addSectionSkills(userData)}
\\end{itemize}}

\\section{Experience}
${addSectionExp(userData)}


\\section{Projects}
${addSectionProject(userData)}

\\section{Education}
\\customcventry{${userData.profile.education[0].start}}{\\color{black}\\href{${userData.profile.education[0].href}}{${userData.profile.education[0].location}}}{${userData.profile.education[0].type}}{${userData.profile.education[0].place}}{}{}{${NLToPars(userData.profile.education[0].remarks)}}
\\end{document} 
    `

    return latextmp
}

function latexTempCvr(userData) {
    const latextmp = `
\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{black}
\\nopagenumbers{}
\\usepackage[utf8]{inputenc}
\\usepackage{ragged2e}
\\usepackage[scale=0.915]{geometry}
\\usepackage{import}
\\usepackage{multicol}
\\usepackage{import}
\\usepackage{enumitem}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb}
\\name{${userData.profile.fname}}{${userData.profile.lname}}
\\newcommand*{\\customcventry}[7][.13em]{
\\begin{tabular}{@{}l}
{\\bfseries #4} \\
{\\itshape #3}
\\end{tabular}
\\hfill
\\begin{tabular}{l@{}}
{\\bfseries #5} \\
{\\itshape #2}
\\end{tabular}
\\ifx&#7&%
\\else{\\
\\begin{minipage}{\\maincolumnwidth}%
\\small#7%
\\end{minipage}}\\fi%
\\par\\addvspace{#1}}
\\begin{document}
\\makecvtitle
\\vspace*{-16mm}
\\begin{center}\\textbf{${userData.profile.description}}\\end{center}
\\begin{center}
\\begin{tabular}{ c c c }
\\faMobile\\enspace ${userData.profile.email} & \\faHome\\enspace ${userData.profile.area} \\\\
\\faLinkedin\\enspace \\color{black} \\href{${userData.profile.linkedin}}{${userData.profile.linkedin_short}} &
\\faGithub\\enspace \\color{black} \\href{${userData.profile.github}}{${userData.profile.github_short}}
\\end{tabular}
\\end{center}

\\section{}
{${userData.datetime},
\\bigskip

    ${NLToParsNNL(userData.address)},
    \\bigskip

    Dear ${userData.addresse},
    \\bigskip
    ${NLToPars(userData.contents)}

    ${userData.profile.fname} ${userData.profile.lname}}

\\end{document} 
    `

    return latextmp
}

function generateLatexTest(userData, latexFunc, res) {
    res.json(latexFunc(userData))
}

function generateLatex(userData, latexFunc, res) {
    const latex = require('node-latex')
    const fs = require('fs')
    const pdf = latex(latexFunc(userData))
    
    const filename = encodeURIComponent("kt-res.pdf")
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    pdf.pipe(res)
    pdf.on('error', err => console.error(err))
    pdf.on('finish', () => console.log('PDF generated!'))
}

module.exports = { generateLatex, generateLatexTest, latexTemp, latexTempCvr};
