//var http = require('http');
//var express = require('express');
//var app = express();
//app.use(express.static(__dirname + '/'));
//var errorhandler = require('errorhandler');
//app.use(errorhandler()); // development only
//var server = http.createServer(app);
var delayed = require('delayed');
var redis = require("redis");
var client = redis.createClient({host : 'localhost', port : 6379});
var io = require('socket.io')
ioServer = io.listen(8080);
console.log('c2_comms running');



ioServer.on('connection', function (socket) {
	
	
//emitir mensajes	al cliente
	


	
//recibir id en la primera conexión

socket.on('id', function (data, fn) {
    

	
	//registro el cliente
	
	client.set(data, socket.id, function(err) {
      if (err) throw err;
     console.log(data + " conectado");
    });
 
	     

});



//recibir mensajes

socket.on('message', function (data, fn) {
    
	//console.log(data);
	
 	var data_object = JSON.parse(data);
 	
 	 
 	 if(data_object.destination == 'c2_comms'){
 	 
 	 if(data_object.type_code == '0')
 	 {
 	 	process.exit();
 	 	}
 	 
 	 }else{	
 	//console.log(data_object.destination);
 	
 	client.get(data_object.destination, function(err, socketId) {
      if (err) throw err;
      //console.log(data_object.origin + ' ' + data_object.destination + ' ' + data);
      ioServer.to(socketId).send(data);
    });
	     
}

});

  

  
    
    
});






