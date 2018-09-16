	//var classes = require('./classes.js')
var io = require('socket.io-client');
var serverUrl = 'http://localhost:8080';
var conn = io.connect(serverUrl);
console.log('USB running');

//envio id
conn.emit('id', 'c4_ardu', function(resp, data) {
    //console.log(message_object);
});

var port_arg = "pepe";


var SerialPort = require('serialport');// include the library


var myPort = new SerialPort(port_arg, {
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   //parser: SerialPort.parsers.readline("\n")
 });
 


myPort.on('open', onPortOpen);

myPort.on('close', function_PortClose);
myPort.on('data', onData);

function onClose(){
    console.log("Port is closed, yo");
}

function onPortOpen(){
    console.log("Port connected on "+port_arg);
}


function onData(d)
{
    console.log("data dis, data dat "+d)
}





//recibo información
conn.on('message', function(msg){
     //console.log(msg);
     
msg_object = JSON.parse(msg);  


//info

if(msg_object.type_code == '100'){

console.log(msg_object.value_text);
} 

//cierre

if(msg_object.type_code == '0'){

process.exit();
}    


//seleccion de mensajes

if(msg_object.type_code == '5'){

var port_name = msg_object.value_text;

//console.log(port_name);



myPort = new SerialPort(port_name, {
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   //parser: SerialPort.parsers.readline("\n")
 });
 

var message_local = new classes.message_object('c4_ardu','c1_main','20','1');
var message_json = JSON.stringify(message_local);

conn.send(message_json, function(resp, data) {}); 
 
var message_local = new classes.message_object('c4_ardu','c3_web','20','Arduino Connected on port: '+port_name);
var message_json = JSON.stringify(message_local);

conn.send(message_json, function(resp, data) {});





//console.log(port);

//setInterval(test,100);

//setInterval(test1,200);




}
     
     
});




function function_PortClose(){


console.log('cerrando...')

var message_local = new classes.message_object('c4_ardu','c3_web','20','Not connected');
var message_json = JSON.stringify(message_local);

conn.send(message_json, function(resp, data) {});

var message_local = new classes.message_object('c4_ardu','c1_main','20','0');
var message_json = JSON.stringify(message_local);

conn.send(message_json, function(resp, data) {});


var message_local = new classes.message_object('c4_ardu','c1_main','11','');
var message_json = JSON.stringify(message_local);

conn.send(message_json, function(resp, data) {});

}

