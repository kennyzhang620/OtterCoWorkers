//alert("grrr")
//this is where the textbox info is sent to show on the alert dialog
chrome.runtime.onMessage.addListener(function(request){
   alert(request)
   const to_respond = request.stringify()
   //redirect("/index.js")
   //app.get('/capture', (req, res) => res.render('pages/scan_image'));

})
chrome.runtime.post('./index', to_respond)
//gpt 3 api key
//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