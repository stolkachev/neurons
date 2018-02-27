var userId = 'Guest';
var access_token = '1f6601c5-05b8-4da5-9774-ea7362a8fa2e';
var session_Id = '';
var websocket_Server = '';

var ws_iframe = document.getElementById('ws_home');
var ws_iframe_api = ws_iframe.contentWindow;
var api_url = 'nnod_api.htm?env=web';
var div = document.getElementById('consoleLog');

/// CALL BACKS
function ws_onOpen(msg) {
    div.innerHTML = div.innerHTML + msg + '<br>';
    document.getElementById('connectButton').style.background = "rgba(255,0,0,0.2)";
    document.getElementById('connectButton').value = "CONNECTED";
}

function ws_onClose(msg) {
    //           div.innerHTML = div.innerHTML + msg + '<br>';
    document.getElementById('connectButton').style.background = "#cccccc";
    document.getElementById('connectButton').value = "Connect";
}

function ws_onMessage(msg) {
    if (msg === "PONG:PING" || msg === "PING:PONG") return;
    div.innerHTML = div.innerHTML + "<font color='red'>" + msg + '</font><br>';
    var particles = msg.split(":");
    if (particles.length === 6) {
        if (particles[2] === 'BROADCAST') {
            ws_disconnect();
            session_Id = particles[0]
            div.innerHTML = div.innerHTML + "Connecting as " + session_Id + '<br>';
            ws_connect()
        }
    }
    if (particles.length === 2) {
        if (particles[1] === 'DISCONNECTED') {
            ws_disconnect();
            session_Id = document.getElementById('sessionId').value;
            div.innerHTML = div.innerHTML + "Connecting as " + session_Id + '<br>';
            ws_connect()
        }
    }
}

function ws_onError(msg) {
    div.innerHTML = div.innerHTML + msg + '<br>';
}

function ws_onLoad(msg) {
    div.innerHTML = div.innerHTML + msg + '<br>';
}
/// CALLS
function ws_connect() {
    msg = ws_iframe_api.ext_init(userId, access_token, session_Id, websocket_Server);
    if (msg != "0" && msg != undefined) {
        div.innerHTML = div.innerHTML + msg + '<br>';
    }
    document.getElementById('connectButton').style.background = "rgba(255,0,0,0.2)";
    document.getElementById('connectButton').value = "CONNECTED";
}

function ws_send_Q() {
    msg = document.getElementById('qId').value;
    div.innerHTML = div.innerHTML + "<font color='blue'>" + msg + '</font><br>';
    ws_iframe_api.ext_send(userId + ":" + msg);
    document.getElementById('qId').value = "";
}

function ws_disconnect() {
    ws_iframe_api.ext_close();
    document.getElementById('connectButton').style.background = "#cccccc";
    document.getElementById('connectButton').value = "Connect";
}

function load_completed() {
    session_Id = document.getElementById('sessionId').value;
    userId = document.getElementById('userId').value;
    document.getElementById("qr_code").src = "http://www.256gl.com/notes/clientbin/get_qr_barcode.ashx?session_ID=" + session_Id;
    websocket_Server = document.getElementById('serverId').value;
    ws_iframe.src = api_url;
}

function handleKeyPressed(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        ws_send_Q();
    }
}

function userID_Changed() {
    userId = document.getElementById('userId').value;
}

function sessionID_Changed() {
    session_Id = document.getElementById('sessionId').value;
    document.getElementById("qr_code").src = "http://www.256gl.com/notes/clientbin/get_qr_barcode.ashx?session_ID=" + session_Id;
}

function serverId_Changed() {
    websocket_Server = document.getElementById('serverId').value;
    document.getElementById("qr_code").src = "http://www.256gl.com/notes/clientbin/get_qr_barcode.ashx?session_ID=" + session_Id;
}