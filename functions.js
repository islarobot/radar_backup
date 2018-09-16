


//funciones 
 var config = require('./config');

 
 function request_project_pdf(url){

var request = require('sync-request');
var config = require('./config');
var uri = config.jsonurl + url;
 
var res = request('GET', uri, {
  'headers': {
    'user-agent': 'example-user-agent',
    'Content-type' : 'applcation/pdf'
  }
});
 
if (res.statusCode == 404) {
	
		return 'noencontrada'
		
	}else{

return res.getBody('utf8')

}

}
 
function request_project_file(url){

var request = require('sync-request');
var config = require('./config');
var uri = config.jsonurl + url;



var res = request('GET', uri, {
  'headers': {
    'user-agent': 'example-user-agent'
  }
});



if (res.statusCode == 404) {
	

		return 'noencontrada'
		
	}else{
	

return res.getBody('utf8')

}

}


function select_project(id)
{





}
 
    
function parse_json_projects()
{

//recupero index
indexjson = request_project_file('index.json');
index_object = JSON.parse(indexjson);

//console.log(indexjson)

return index_object

}
    
function return_project_json_file(id,po)
{
var code_1
for(var i = 0; i < po.length; i++) {
for(var j = 0; j < po[i].projects.length; j++) {
if(po[i].projects[j].id == id){
var url_1 = po[i].projects[j].file

return url_1
//var value1 = {code:code_1, name:projects_object[i].projects[j].name}

//return JSON.stringify(value1)

}


}
}
}   

function return_project_info(id,po)
{
var url_1 = 'None'
var url_2 = 'None'
for(var i = 0; i < po.length; i++) {
	
for(var j = 0; j < po[i].projects.length; j++) {

if(po[i].projects[j].id == id){

url_1 = po[i].projects[j].name
url_2 = po[i].projects[j].file




//var value1 = {code:code_1, name:projects_object[i].projects[j].name}

//return JSON.stringify(value1)

}


}
}
return {"name":url_1,"file":url_2}
}  
    
    
    
function decode_to_socket(type_code){
	
var answer = {type_code_local, destination_local}	

switch(type_code) {
    case 'request usb':
        type_code_local = 2;
        destination_local = 'c5_usb';
        return answer;
        break;
    
    //default:
      
}

}

function decode_to_web_client(type_code){
	
	
switch(type_code) {

    case '9':
        return 'usb_list'
        
        break;
    case '20':
        return 'state'
     case '21':
        return 'state_data'
        break;
    case '100':
        return 'stream'
        break;
    //default:
      
}

}
  
  
function update_arduino(text,port,board){
	

	
create_ino_file(text)

var spawn = require('child_process').spawn, 

ino    = spawn('arduino', ['--upload --port '+port+' '+config.src_ino_file],{cwd: 'projects/source/'});

ino.on('exit', function (code) { 

 console.log('uploaded')
 
 
 });



}  

function create_ino_file(text){
	

	
var fs = require('fs');
var config = require('./config');
var path = require('path');
var file = path.join(__dirname,config.src_ino_file);




fs.writeFile(file, text, function (err) {
  if (err) return console.log(err);
  
});


}  







function upload_ino()
{

var spawn = require('child_process').spawn,
    ino    = spawn('ino', ['upload'],{cwd: 'projects/source/'});
    console.log('upload')

}

function return_project_documentation(json)
{

if (json == 'noencontrada') { 

//io.emit('active_project_tutorial', {okcode:"jsonnoencontrada", text:""});

return {"okcode":"jsonnoencontrada", "text":""};

}

json_project_file = request_project_file(json);

if (json_project_file == 'noencontrada') { 

return {"okcode":"codenoencontrada", "text":""};

}



object_project_file = JSON.parse(json_project_file);

if (object_project_file.tutorial_type = 'html') {
	
html_tutorial = return_html_tutorial(object_project_file);



return {"okcode":"html", "text":html_tutorial};

}

if (object_project_file.tutorial_type = 'pdf') {
	
pdf_tutorial = object_project_file.tutorial_pdf;

return {okcode:"pdf", text:pdf_tutorial};

}

return {"okcode":"error", "text":""};

}

function return_html_tutorial(object)
{
	


html = '';

html += '<!DOCTYPE html><html><head><meta charset="UTF-8">'

html += '<title>'+object.project_title+'</title></head>'

html +='<body>'

html +='<p><strong>Introduction</strong></p><p>'+object.tutorial_html.introduction_text+'</p><p><strong>Components</strong></p>'

html += '<p>'+object.tutorial_html.comments_components+'</p><p>&nbsp;</p>'

html += '<p><strong>Layout</strong></p><p>'+object.tutorial_html.layout_text_prev+'</p><p><img src="'+config.jsonurl+object.tutorial_html.image_layout+'" style="width:304px;height:228px;"></p><p>'+object.tutorial_html.layout_text_post+'</p><p>&nbsp;</p>'

html += '<p><strong>Code</strong></p><p>'+object.tutorial_html.code_text_prev+'</p><p>'+object.tutorial_html.code_text_post+'</p><p>&nbsp;</p>'

html += '<p><strong>Conclusion</strong></p><p>'+object.tutorial_html.conclusion_text+'</p>'



html +='</body>'

html +='</html>'


//html = JSON.stringify(html)





return html

}



function set_project_info(json)
{



json_project_file = request_project_file(json);

if (json_project_file == 'noencontrada') { 

return 0;

}


object_project_file = JSON.parse(json_project_file);

return object_project_file;

}

exports.set_project_info = set_project_info;
exports.return_project_documentation = return_project_documentation;
exports.select_project = select_project;
exports.request_project_file = request_project_file;
exports.request_project_pdf = request_project_pdf;
exports.parse_json_projects = parse_json_projects;
exports.return_project_json_file = return_project_json_file;

exports.return_project_info = return_project_info;

exports.decode_to_socket = decode_to_socket;

exports.update_arduino = update_arduino;

exports.decode_to_web_client = decode_to_web_client;

