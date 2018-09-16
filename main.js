//var classes = require('./classes.js');
var io_client = require('socket.io-client');
var delayed = require('delayed');
var serverUrl = 'http://localhost:8080';
var conn = io_client.connect(serverUrl);
console.log('c1_main running');




var exec_comms = require('child_process').exec,child;

var exec_web = require('child_process').exec,child;



var exec_ardu = require('child_process').exec,child;


//abro terminal y ejecuto comms server

child_comms = exec_comms('gnome-terminal --window-with-profile=islarobot --title=\"Comms Server\" --geometry 73x20+900+0 -x nodejs comms_server.js',
function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }
});


//envio id de main

conn.emit('id', 'c1_main', function(resp, data) {
    //console.log(message_object);
});


//abro terminal y ejecuto web server

child_web = exec_web('gnome-terminal --window-with-profile=islarobot --title=\"Web Server\" --geometry 73x20+0+500 -x nodejs web_server.js',
function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }
});



//abro terminal y ejecuto ardu_comms

child_usb = exec_ardu('gnome-terminal --window-with-profile=islarobot --title="Arduino" --geometry 73x20+900+500 -x nodejs ardu_comms.js',
function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }
    usb_list_on = 1;
});




//recibo información del socket interno
conn.on('message', function(msg){



//parseo mensaje     
msg_object = JSON.parse(msg); 

//seleccion puerto usb

if(msg_object.type_code == '3'){

puerto = msg_object.value_text;
//abro ardu_comms
abrir_ardu_comms(puerto);


}        


 });



process.on( 'SIGINT', function() {
  console.log( "\nShutting down nicely" );
  
	//mandar msg para cerrar los procesos.
	
	//web server
	var message_local = new classes.message_object('c1_main','c3_web','0');
	var message_json = JSON.stringify(message_local);
	conn.send(message_json, function(resp, data) {
    console.log('Shutting down web server');
		});
  

  
  //ardu
	var message_local = new classes.message_object('c1_main','c4_ardu','0');
	var message_json = JSON.stringify(message_local);
	conn.send(message_json, function(resp, data) {
    console.log('Shutting down ardu');
		});

  

  
  
delayed.delay(function () { stopcomms(); }, 500);
delayed.delay(function () { stopmain(); }, 1000); 
  
})




function stopmain () {
	
	//console.log('Shutting down Firefox');
	//kill_firefox(proc_firefox);
	//proc.kill('SIGINT');
		
	
  console.log('Shutting down');
 process.exit();

  
}


function stopcomms () {


 //comms server (último) 
  var message_local = new classes.message_object('c1_main','c2_comms','0','0');
	var message_json = JSON.stringify(message_local);
	conn.send(message_json, function(resp, data) {
    console.log('Shutting down comms server');
		});

 
}




function abrir_ardu_comms(p){

child_ardu = exec_ardu('gnome-terminal --title="Arduino Comms" --geometry 73x20+900+500 -x nodejs ardu_comms.js '+p,
function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }
    ardu_on = 1;
});


}










