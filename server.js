var net = require('net');


var serverInternal;

var externalClient;
var internalClients = {};

var config = {};
config.port = '4242';
config.host = '127.0.0.1';

var DEBUG = true;

/* ******************** */
/* ***** EXTERNAL ***** */
/* ******************** */


/* ******************** */
/* ***** INTERNAL ***** */
/* ******************** */
serverInternal = net.createServer(function (socket) {
	
	console.log('fdfd')
	socket.on('connect', function() {
		if (DEBUG) {
			console.log("Conectado");
		}
	});

	socket.on('end', function() {
		if (DEBUG) {
			var date = new Date();
			console.log("INTERNAL - " + date.toString() + " - Conexión terminada");
		}
	});

	socket.on('close', function() {
		if (DEBUG) {
			var date = new Date();
			console.log("INTERNAL - " + date.toString() + " - Conexión cerrada");
		}
	});

	socket.on('error', function() {
		console.log("SOCKET CERRADO POR ANTICIPADO.");
	});
});

/* ******************** */
/* **** CONNECTIONS *** */
/* ******************** */
serverInternal.listen('60004', '127.0.0.1');

serverInternal.on('connection', function (data) {
	if (DEBUG) {
		var date = new Date();
		console.log("INTERNAL - " + date.toString() + " - Conexión establecida");
	}
});

/* ******************** */
/* **** FUNCTIONS ***** */
/* ******************** */
function jsonToEleincoFormat (json) {
	return JSON.stringify(json);
}

function eleincoFormatToJson (message) {
	return JSON.parse(message);
}
