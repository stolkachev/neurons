"use strict";
process.title = '256GL Connection Bus';
var webSocketsServerPort = process.env.PORT || 55438;
var webSocketServer = require('websocket').server;
var http = require('http');
var uuid = require('node-uuid');
var clients = [];
var ETX = String.fromCharCode(3);
//const util = require('util')

var server = http.createServer(function(request, response) {});

server.listen(webSocketsServerPort, function() {
    console.log("Server 2.11 is listening ");
});

var wsServer = new webSocketServer({ httpServer: server });

wsServer.on('request', function(request) {
    var splitter = request.remoteAddress.split(":");
    var remoteAddress = splitter[splitter.length - 1];
    remoteAddress = request.remoteAddress;
    var connection = request.accept(null, request.origin);
    var u_id = 0;
    var session_Id = "";
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            if (message.utf8Data.toLowerCase().indexOf("session_id=") === 0) {
                session_Id = message.utf8Data.toLowerCase().replace("session_id=", "");
                u_id = uuid.v1();
                var con_obj = {
                    U_id: u_id,
                    Session_Id: session_Id,
                    Connection: connection,
                    RemoteAddress: remoteAddress
                };
                clients.push(con_obj);
                var options = { hour12: false };
                var tstamp = new Date().toLocaleString('en-US', options).replace(', ', ' ').replace(/\//g, '-');
                console.log('-> ' + remoteAddress + " " + tstamp + " " + con_obj.Session_Id + " L=" + clients.length);
            } else {
                if (message.utf8Data.toLowerCase() === "?") {
                    var client = null
                    var connected_clients = 0
                    for (var i = 0; i < clients.length; i++) {
                        if (clients[i].Session_Id == session_Id) {
                            connected_clients = connected_clients + 1
                        }
                    }
                    try {
                        connection.sendUTF("?" + ETX + connected_clients);
                    } catch (Error) { console.log("ERROR 1: " + Error); }
                } else {
                    if (message.utf8Data.toLowerCase().indexOf("ping") === 0) {

                    } else {
                        for (var i = 0; i < clients.length; i++) {
                            if (!clients[i].Connection.connected) {
                                console.log("Disconnected! " + clients[i].RemoteAddress);
                            }
                            if (clients[i].Session_Id == session_Id && clients[i].U_id != u_id) {
                                try {
                                    clients[i].Connection.sendUTF(message.utf8Data);
                                } catch (Error) { console.log("ERROR 2: " + Error); }
                            } else {
                                if (clients[i].U_id != u_id) {
                                    var particles = message.utf8Data.split(ETX);
                                    if (particles.length === 4 || particles.length === 5) {
                                        var broadcast_name = particles[2].toLowerCase()

                                        if (particles[1] === 'BROADCAST' && broadcast_name === clients[i].Session_Id.toLowerCase()) {
                                            try {
                                                clients[i].Connection.sendUTF(session_Id + ETX + message.utf8Data);
                                                break;
                                            } catch (Error) { console.log("ERROR 3: " + Error); }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    connection.on('close', function(connection) {
        {
            try {
                var l_index = -1;
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i].U_id == u_id) {
                        l_index = i;
                        break;
                    }
                }
                if (!clients[l_index]) {
                    return;
                }
                var cc_id = clients[l_index].Session_Id
                clients.splice(l_index, 1);
                var options = { hour12: false };
                var tstamp = new Date().toLocaleString('en-US', options).replace(', ', ' ').replace(/\//g, '-');
                console.log('<- ' + remoteAddress + " " + tstamp + " " + cc_id + " L=" + clients.length);
            } catch (Error) { console.log(Error); }
        }
    });
});