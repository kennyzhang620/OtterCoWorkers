var translations = []
var intervalM = 3;
let textbox = document.getElementById('search');

      textbox.addEventListener('keypress', function(k) {

        if (k.key == 'Enter') {

          Generate_message(textbox.value);

		  sendmail(textbox.value)
          //!-- Disappears text in textbox -->
		  ind = translations.length - 1
		  timer2 = setInterval(render, 1000)
		  
		  textbox.value = '';
        }

    });


function sendmail(email) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	       translations =  JSON.parse(xhttp.responseText);
		   intervalM--;
	    }
	};
	xhttp.open("GET", "http://localhost:5010/addmail/" + email);
	xhttp.send();
	
}
function Generate_message(input_text) {

  var message_list = document.getElementsByClassName("message_input");

  if (message_item != null);

    var message_item  = message_list[0];

    var x = `<div id = 'message_bubble' 
              style= "border-radius: 50px;
                      padding: 5px;

                      font-size: 20px;
                      font-family: Arial;

                      width: max-content;

                      border: solid;
                      
                      justify-content: right;
                      align-item: right:
                      margin-top:
                      background-color: rgb(255, 255, 255);"
                      >${input_text} </div>`
    
    var message_node = document.createRange().createContextualFragment(x);
    message_item.appendChild(message_node);
}

const timer = setInterval(callHome_30_s, 500);
var timer2 = null;
var ind = 0;

function callHome_30_s() {
	if (translations.length <= 0) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	       translations =  JSON.parse(xhttp.responseText);
		   intervalM--;
	    }
	};
	xhttp.open("GET", "http://localhost:5010/chatrecvm", true);
	xhttp.send();
	}
	else {
		clearInterval(timer);
	}
	
	console.log(translations);

}


function render() {
	if (ind <= 0) {
		clearInterval(timer2)
	}
	else {
		Generate_message(translations[(translations.length - 1) - ind--])
	}
}




      