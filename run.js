//var classes = require('./classes.js');
var io_client = require('socket.io-client');
var delayed = require('delayed');
var serverUrl = 'http://localhost:8080';
var conn = io_client.connect(serverUrl);
console.log('Main running');






var exec_ardu = require('child_process').exec,child;
var exec_lista = require('child_process').exec,child;
var exec_redis = require('child_process').exec,child;

//abro terminal y ejecuto ardu_comms

child_usb = exec_ardu('gnome-terminal --window-with-profile=islarobot --title="Arduino" --geometry 73x20+0+500 -x nodejs ardu_comms.js',
function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }

});

//abro terminal y ejecuto ardu_lista

child_lista = exec_lista('gnome-terminal --window-with-profile=islarobot --title="Arduino" --geometry 73x20+900+500 -x nodejs ardu_lista.js',
function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }

});

//abro terminal y ejecuto redis-server

child_lista = exec_lista('gnome-terminal --window-with-profile=islarobot --title="Arduino" --geometry 73x20+900+0 -x redis-server',
function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }

});