var redis = require('redis');
var client = redis.createClient(); // this creates a new client

client.on('connect', function() {
    console.log('Redis client connected');
});


client.get('port0', function (error, result) {
    if (error) {
        console.log(error);
        throw error;
    }
    console.log('GET result ->' + result);
});