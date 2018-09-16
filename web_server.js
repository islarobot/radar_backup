//var classes = require('./classes.js')
var functions = require('./functions.js')
var io_client = require('socket.io-client');
var serverUrl = 'http://localhost:8080';
var conn = io_client.connect(serverUrl);
var path = require("path");
var urlencode = require('urlencode');

var config = require('./config')
var request = require('request');
var pdfDocument = require('pdfkit');

var active_project = 0;
var projects_object;
var current_project_object;

console.log('c3_web running');

//parseo json de proyectos

projects_object = functions.parse_json_projects()




//envio id
conn.emit('id', 'c3_web', function(resp, data) {
    //console.log(message_object);
});


//abro firefox

var message_local = new classes.message_object('c3_web','c1_main','10','');
var message_json = JSON.stringify(message_local);

//espero 3 segundos a que se conecte a comms.


setTimeout(function () {



conn.send(message_json)
  
}, 3000)




//envio información
//conn.send(message_json, function(resp, data) { //console.log(message_object);});




//SOCKET INTERNO


conn.on('message', function(msg){


//parseo mensaje     

var msg_object = JSON.parse(msg);     

//envio a web todo lo que recibo

//console.log(msg)

io.emit(functions.decode_to_web_client(msg_object.type_code),JSON.stringify(msg_object.value_text));


if(msg_object.type_code == '0'){

process.exit();
}

//solicita conexión de puerto después de haber confirmado con main que usb está arriba.

if(msg_object.type_code == '6'){
			var message_local = new classes.message_object('c3_web','c5_usb','2','');
 			var message_json = JSON.stringify(message_local);
			conn.send(message_json);
			
			//console.log('5 web solicita a usb listado de puertos')

}

 });




//SERVIDOR WEB



var express = require('express');
var app = express();
var http = require('http');
var io = require('socket.io');


app.use(express.static('public'));


var server =http.createServer(app).listen(8070);

io = io.listen(server);


app.get('/project_code', function (req, res) {
	
	
		var id = req.query.id;
	

		res.sendFile('project_code.html', { root: path.join(__dirname, 'public') });


})


app.get('/project_docu', function (req, res) {
	

	
		var id = req.query.id;
				
		
	
	   active_project = id;
		res.sendFile('project_docu.html', { root: path.join(__dirname, 'public') });

})

app.get('/project_adddocu', function (req, res) {
	
	
		var id = req.query.id;
	
	   
		res.sendFile('project_adddocu.html', { root: path.join(__dirname, 'public') });

})



app.get('/pdf', function (req, res) {


url = current_project_object.tutorial_pdf	


https = require('https')

  //var url = 'https://raw.githubusercontent.com/islarobot/arduino-projects/master/introduction.pdf'

var url = config.jsonurl+url
	
  https.get(url, function(response) {

      var chunks = [];

      response.on('data', function(chunk) {



          chunks.push(chunk);

      });

      response.on("end", function() {



          //var jsfile = new Buffer.concat(chunks).toString('base64');
          var jsfile = new Buffer.concat(chunks);
          	
			res.writeHead(200, {
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'inline; filename=1.pdf',
  'Content-Length': jsfile.length
});
res.end(jsfile);   
				
          
      });

  }).on("error", function() {

      console.log('error')

  });

});


io.sockets.on("connection",function(socket_web){

console.log('client connected');

//recibo información del cliente
    socket_web.on("message",function(data){
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        data1 = JSON.parse(data);
 
			conn.send(data);
        /*Printing the data */
        //console.log(data)


    });
    
     //recibo info para enviar al arduino
    
    socket_web.on("send_info",function(data){

			//compruebo que usb_comms está corriendo

			var message_local = new classes.message_object('c3_web','c4_ardu','100',data);
 			var message_json = JSON.stringify(message_local);
			conn.send(message_json);
			
			
    });
    
    
    //solicitud de lista de dispositivos usb
    
    socket_web.on("request_usb",function(data){

			//compruebo que usb_comms está corriendo

			var message_local = new classes.message_object('c3_web','c1_main','6','c5_usb');
 			var message_json = JSON.stringify(message_local);
			conn.send(message_json);
			
			//console.log('1. recibo petición web para listado de puertos usb')
			//console.log('2. envío confirmacion a main de que usb esta abierto')
      
    });
    
    //petición de estado
 
	   socket_web.on("request_state",function(data){

			var message_local = new classes.message_object('c3_web','c1_main','21','');
 			var message_json = JSON.stringify(message_local);
			conn.send(message_json);
			//console.log(message_json)
		
     		
    }); 
    
     //petición codigo de proyecto activo
 
	   socket_web.on("request_active_project_code",function(data){
	   	
		json_project_file = functions.return_project_json_file(active_project,projects_object)
			
		json_project = functions.request_project_file(json_project_file)
		
		if (json_project == 'noencontrada') {
		
		oktext = 'jsonnoencontrada';		
		text1 = ""
		}else {
		
		object_project = JSON.parse(json_project);
		
		code_url = object_project.code
		

		
		code_file = functions.request_project_file(code_url)
		
		if (code_file == 'noencontrada') {
			
		oktext = 'codenoencontrada';
		text1 = ""
		}else {
		oktext = "ok"
		text1 = code_file		
		
		}		
		}

		sendobject = {okcode:oktext, text:text1};
		sendobject = JSON.stringify(sendobject)
		
		io.emit('active_project_code',sendobject);
		

    }); 
    
         //petición documento de proyecto activo
 
	   socket_web.on("request_active_project_documentation",function(data){
	   	
			   	
	   	
		
		
		json_file = functions.return_project_json_file(active_project,projects_object)		
		
		answer = functions.return_project_documentation(json_file);		
		
		answer_json = JSON.stringify(answer)
		
		io.emit('active_project_tutorial', answer_json);
		

    });
    
		socket_web.on("request_active_project_additional_documentation",function(data){
		
		json_file = functions.return_project_json_file(active_project,projects_object)		

		//console.log(JSON.stringify(projects_object))

		answer = functions.request_project_file(json_file)
		
		
		//console.log(answer)		
		
		answer_object = JSON.parse(answer)
		
		pdf_file = answer_object.tutorial_pdf
		

		
		pdf_file = urlencode(pdf_file)
		//pdf_file_binary = config.jsonurl + pdf_file
		
		//binary = functions.request_project_pdf(pdf_file_binary)
		
		//console.log(binary)
		//console.log(binary64)
		//var binary64 = binary.toString('base64');
				
				
	
		io.emit('active_project_additional_tutorial', '1');
		
		
		

    });    
    
    
     //petición de info de proyecto activo
 
	   socket_web.on("request_active_project_info",function(data){


		if (active_project == 0) { active_project = 1;}
		
		project_info = functions.return_project_info(active_project,projects_object)
		
		current_project_object = functions.set_project_info(project_info.file)
	
		current_project_json = JSON.stringify(current_project_object)
		
		data = '{"name":"'+project_info.name+'", "info":'+current_project_json+'}'
		

		io.emit('active_project_info',data);
		

    });    
    
		socket_web.on("request_active_project_params",function(data){
	   
		params = current_project_object.parameters
		
		params = JSON.stringify(params)
		
		io.emit('active_project_params',params);
		
		

    });    
    
    
    //selección de dispositivo usb
    
    socket_web.on("select_usb",function(data){

			var message_local = new classes.message_object('c3_web','c1_main','3',data);
 			var message_json = JSON.stringify(message_local);
			conn.send(message_json);
        /*Printing the data */
     		

    });
    
    //solicitud de proyectos
    
       socket_web.on("request_projects",function(data){
       	
       	projects_json = JSON.stringify(projects_object);

		io.emit('projects',projects_json);

			//console.log(projects_json);
     		
    });
    
    
    //seleccion de proyecto
 
	   socket_web.on("select_project",function(data){

		functions.select_project(data);
		
     		
    }); 
    
        //update arduino
        
     socket_web.on("update_arduino",function(data){
     	
     	//disconnect arduino
     	
     	var message_local = new classes.message_object('c3_web','c1_main','22','');
		var message_json = JSON.stringify(message_local);

		conn.send(message_json, function(resp, data) {});

		functions.update_arduino(data);
		

     		
    }); 
    
         //update index
 
	   socket_web.on("update_index",function(data){

		projects_object = functions.parse_json_projects()

		io.emit('index_updated','');

    });  
 
});




















