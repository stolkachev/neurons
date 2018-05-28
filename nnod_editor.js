var l_url = new URL(location);
var token = l_url.searchParams.get("token");
var u_id = '17';
if (token != null) {
    var get_uid_Url = "/slq_get_uid.php?token=" + token;
    u_id = synch_XMLHttpRequest(get_uid_Url);
}

var userId = 'NNOD Editor';
var header = 'nnod://chat/'
var session_id = 'editor';
var ETX = String.fromCharCode(3);
var ws_Server = 'ws://256gl.com:55438';
var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 80,
    height: 80
});

var connected = false;
var ws_iframe = document.getElementById('ws_home');
var ws_iframe_api = ws_iframe.contentWindow;
var api_url = 'nnod_api.htm?env=web';

var generic_triggers_url = "triggers/triggers_generic.xml";
var local_triggers_url = "triggers/triggers_1.xml";
var linguistic_URLs = [];
var layers = [];
var layer = null;
var url;

var words_layer = null;
var generic_triggers_layer = null;

var exportValue = null;
var resizeTimeOut;

var neurons = null;
var nevres = null;
var current_shape = null;
var shapes = {
    "starter": "ellipse",
    "prompt": "box",
    "sema": "circle",
    "contexter": "star",
    "answer": "database"
};
var shapes_colors = {
    "starter": "#FADBD8",
    "prompt": "#E5E7E9",
    "sema": "#A9DFBF",
    "contexter": "#C5000B",
    "answer": "#AED6F1"
};

var nodes = null;
var edges = null;
var network = null;

var container = document.getElementById('nodes');
var options = null;

function draw() {
    data = {
        nodes: nodes,
        edges: edges
    };

    options = {

        nodes: {
            shape: 'circle',
            borderWidth: 1,
            borderWidthSelected: 1,
            color: {
                border: 'lightgrey',
                background: 'white',
                highlight: {
                    border: 'lightgrey',
                    background: 'red'
                },
                hover: {
                    border: 'lightgrey',
                    background: 'red'
                }
            },
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                size: 10,
                x: 10,
                y: 10
            },
        },

        edges: {
            color: {
                color: 'lightgrey',
                highlight: 'red',
                hover: 'red',
                inherit: 'from',
                opacity: 1.0
            },
            smooth: false,
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 1,
                    type: 'arrow'
                }
            },
            shadow: {
                enabled: false,
            },
        },
        autoResize: true,
        physics: {
            enabled: false
        },
        interaction: {
            hover: true,
            zoomView: true,
            multiselect: false
        },
        manipulation: {
            enabled: true,
            addNode: onAddNode,
            addEdge: onAddEge,
            deleteNode: onDeleteNode,
            deleteEdge: onDeleteEdge
        },
        layout: {
            randomSeed: undefined,
            improvedLayout: false
        }
    };
    network = new vis.Network(container, data, options);

    network.on("click", function(params) {
        var node_id = params.nodes[0];

        // nodes.forEach(addConnections);
        // exportValue = JSON.stringify(nodes, undefined, 2);

    });

    network.on("doubleClick", function(params) {
        params.event = "[original event]";
        // alert(JSON.stringify(params, null, 4))
        var node_id = params.nodes[0];
        if (node_id == undefined) return;
        var nnod_node = window.open(nnod_node_Url + "&node_id=" + node_id, "nnod_node", "width=500,height=500");
    });

    network.on("dragEnd", function(params) {
        ondragEnd(params);
    });
}

window.onresize = function(event) {
    event.stopPropagation();
    event.preventDefault();
    clearTimeout(resizeTimeOut);
    resizeTimeOut = setTimeout(Redraw, 500);
    return false;
};

function Page_Loaded() {
    session_id = session_id + "_" + random(7);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", get_Neurons_Url, false);
    xmlHttp.send(null);
    neurons = xmlHttp.responseText;
    xmlHttp.open("GET", get_Nerves_Url, false);
    xmlHttp.send(null);
    nevres = xmlHttp.responseText;
    var a_neurons = neurons.split("\n");
    var a_nerves = nevres.split("\n");

    nodes = new vis.DataSet();
    a_neurons.forEach(function(element) {
        var parts = element.split("\t");
        if (parts.length < 5) {
            return;
        }
        var grp = parts[2].toLowerCase();
        if (grp == "contexter") 
        {
            var url = get_Node_Info_Url + "&node_id=" + parts[0];
            var result = synch_XMLHttpRequest(url);
            var splits = result.split("\t");
            linguistic_URLs.push(splits[2]);
        }
        if (grp == "question") grp = "prompt";
        nodes.add({
            id: parts[0],
            shape: shapes[grp],
            label: parts[3],
            x: parts[4],
            y: parts[5]
        });

        var node = nodes.get(parts[0]);
        node.color = {
            border: 'lightgrey',
            background: shapes_colors[grp],
            highlight: {
                border: 'lightgrey',
                background: 'red'
            },
            hover: {
                border: 'lightgrey',
                background: 'red'
            }
        }
        nodes.update(node);
    })

    edges = new vis.DataSet();
    a_nerves.forEach(function(element) {
        var parts = element.split("\t");
        if (parts.length < 3) {
            return;
        }
        edges.add({
            id: parts[0],
            from: parts[1],
            to: parts[2]
        });
    })
    Init_Draw();
    load_neurons();
    ws_iframe.src = api_url;
}

function Init_Draw() {
    var mynetwork = document.getElementById('nodes');
    var x1 = window.innerWidth - 100;
    var y1 = window.innerHeight - 80;
    mynetwork.style.width = x1 + "px";
    mynetwork.style.height = y1 + "px";
    mynetwork.style.left = "90px";
    draw();
    network.fit();
}

function Redraw() {
    var mynetwork = document.getElementById('nodes');
    var x1 = window.innerWidth - 100;
    var y1 = window.innerHeight - 80;
    mynetwork.style.width = x1 + "px";
    mynetwork.style.height = y1 + "px";
    mynetwork.style.left = "90px";
    //            network = new vis.Network(container, data, options);
};

function objectToArray(obj) {
    return Object.keys(obj).map(function(key) {
        obj[key].id = key;
        return obj[key];
    });
}

function addConnections(elem, index) {
    var arr = [];
    edges.forEach(function(element) {
        if (element.from == elem.id) {
            arr.push(element.to);
        }
    });
    elem.connections = arr;
}

function getNodeData(data) {
    var networkNodes = [];
    data.forEach(function(elem, index, array) {
        networkNodes.push({
            id: elem.id,
            label: elem.id,
            x: elem.x,
            y: elem.y
        });
    });
    return new vis.DataSet(networkNodes);
}

function getNodeById(data, id) {
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {
            return data[n];
        }
    };
    throw 'Can not find id \'' + id + '\' in data';
}

function getEdgeData(data) {
    var networkEdges = [];
    data.forEach(function(node) {
        node.connections.forEach(function(connId, cIndex, conns) {
            networkEdges.push({
                from: node.id,
                to: connId
            });
            let cNode = getNodeById(data, connId);
            var elementConnections = cNode.connections;
            var duplicateIndex = elementConnections.findIndex(function(connection) {
                return connection == node.id;
            });
            if (duplicateIndex != -1) {
                elementConnections.splice(duplicateIndex, 1);
            };
        });
    });
    return new vis.DataSet(networkEdges);
}

function over_image(obj) {
    if (current_shape != null) return;
    if (obj.border != "4") {
        obj.border = "2"
    }
};

function out_image(obj) {
    if (current_shape != null) return;
    if (obj.border != "4") {
        obj.border = "0"
    }
};

function click_on_image(obj) {
    document.getElementById('starter').border = "0";
    document.getElementById('prompt').border = "0";
    document.getElementById('sema').border = "0";
    document.getElementById('contexter').border = "0";
    document.getElementById('answer').border = "0";
    if (current_shape == obj.id) {
        current_shape = null;
        return;
    }
    obj.border = "4"
    current_shape = obj.id;
};

// EVENTS:
function ondragEnd(params) {
    params.event = "[original event]";
    if (params.nodes == "" || params.nodes == undefined) return;
    var node_id = params.nodes;
    var x = params.pointer.canvas.x;
    var y = params.pointer.canvas.y;
    var url = update_Node_Coordinates_Url + "&node_id=" + node_id + "&x=" + x + "&y=" + y;
    var result = synch_XMLHttpRequest(url);
}

function onDeleteNode(toBeDeletedData, callback) {
    var node_id = toBeDeletedData.nodes;
    var url = delete_Node_Url + "&node_id=" + node_id;
    var result = synch_XMLHttpRequest(url);
    callback(toBeDeletedData);
}

function onDeleteEdge(toBeDeletedData, callback) {
    var edge_id = toBeDeletedData.edges;
    var url = delete_Edge_Url + "&edge_id=" + edge_id;
    var result = synch_XMLHttpRequest(url);
    callback(toBeDeletedData);
}

function onAddEge(nodeData, callback) {
    var from = nodeData.from;
    var to = nodeData.to;
    var url = add_Edge_Url + "&from=" + from + "&to=" + to;
    var result = synch_XMLHttpRequest(url);
    nodeData.id = result;
    callback(nodeData);
}

function onAddNode(nodeData, callback) {
    if (current_shape == null) {
        alert("Please select shape of the node!")
        return;
    }
    var node_shape = current_shape;
    var x = Math.round(nodeData.x);
    var y = Math.round(nodeData.y);
    var url = add_Node_Url + "&node_shape=" + node_shape + "&x=" + x + "&y=" + y;
    var result = synch_XMLHttpRequest(url);
    nodeData.id = result;
    nodeData.shape = shapes[current_shape];
    nodeData.color = shapes_colors[current_shape];
    nodeData.label = current_shape;
    callback(nodeData);
}

// HTTP Requests:

function synch_XMLHttpRequest(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    var result = xmlHttp.responseText;
    return result;
}

function change_name_callback(node_id, arg) {
    nodes.update({
        id: node_id,
        label: decodeURI(arg)
    });
}
//////////////////// NEURONS
function load_neurons() {
    words_layer = Add_Neuro_Layer(1, -1, 1, 50000, "words");
    generic_triggers_layer = Build_Neural_Layer(generic_triggers_url);
    generic_triggers_layer.Disharged_CallBack = Show_Neural_State;
    layers.push(generic_triggers_layer);
    //   Save_Linguistics_URL(generic_triggers_url);
    // linguistic_URLs = Restore_Linguistics_URLs();
    if (linguistic_URLs != null) {
        for (var i = 0; i < linguistic_URLs.length; i++) {
            url = linguistic_URLs[i];
            if (url == generic_triggers_url) continue;
            layer = Build_Neural_Layer(url);
            layers.push(layer);
            //           Save_Linguistics_URL(url);
        }
    }
    Restore_Neural_State(generic_triggers_layer);
    for (var i = 0; i < layers.length; i++) {
        Restore_Neural_State(layers[i]);
    }
    Show_Neural_State();
    //linguistic_URLs = Restore_Linguistics_URLs();
    add_Layer(local_triggers_url);
}

function Show_Neural_State() {
    var selected = [];
    var neurons = Get_Excited_Neurons(generic_triggers_layer);
    var str_result = "";
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var c_triggers = Get_Charged_Triggers(layer);
        str_result = str_result + "<b><font color=black>" + layer.Name + ":</font></b><br>"

        for (var j = 0; j < c_triggers.length; j++) {
            var splitter = c_triggers[j].split(":")
            str_result = str_result + "<i>" + splitter[0] + ":<font color=red>&nbsp;&nbsp;" + splitter[1] + "</font></i><br>";
            if (splitter[0].toLowerCase() == "starter" || splitter[0].toLowerCase() == "sema" || splitter[0].toLowerCase() == "prompt") {
                var node_id = splitter[1];
                var url = get_Node_Info_Url + "&node_id=" + node_id;
                var result = synch_XMLHttpRequest(url).split("\t");
                evl_result = perform_script(result[2]);
                //               alert(evl_result)
                document.getElementById("Respond").innerHTML = evl_result;
                if (connected) {
                    ws_iframe_api.ext_send(userId + ETX + evl_result);
                }
                selected.push(node_id);
            }
        }
        network.selectNodes(selected, true);
        //           network.selectNodes([node_id], true);
    }
    document.getElementById("Result").innerHTML = str_result;
}

function Reset() {
    Reset_Neurons(null);
    localStorage.clear();
    document.getElementById("Result").innerHTML = "";
    linguistic_URLs = [];
    layers = [];
    layer = null;

    Clean_Personal_Neural_Net();
    load_neurons();
    Show_Neural_State();
}

function add_Layer(linguistic_triggers_url) {
    if (linguistic_URLs == null) {
        layer = Build_Neural_Layer(linguistic_triggers_url);
        layers.push(layer);
        Show_Neural_State();
    } else {
        for (var k = 0; k < linguistic_URLs.length; k++) {
            if (linguistic_URLs[k] == linguistic_triggers_url) return;
        }
        layer = Build_Neural_Layer(linguistic_triggers_url);
        layers.push(layer);
        //       Save_Linguistics_URL(linguistic_triggers_url);
        // linguistic_URLs = Restore_Linguistics_URLs();
        Show_Neural_State();
    }
}

function check_Controls() {
    var g_neurons = Get_Excited_Neurons(generic_triggers_layer);
    if (g_neurons == null) return;
    for (var i = 0; i < g_neurons.length; i++) {
        var nl = g_neurons[i];
        var splitter = nl.Name.split(':');

        // if (nl.Name.toLowerCase() == "health:headache") {
        //     add_Layer(headache_triggers_url);
        // }

        // if (nl.Name.toLowerCase() == "shopping:wine") {
        //     add_Layer(wines_triggers_url);
        // }

        // if (nl.Name.toLowerCase() == "shopping:car") {
        //     add_Layer(cars_triggers_url);
        // }

        if (nl.Name.toLowerCase() == "clear:clear") {
            localStorage.clear();
            Reset();
        }
    }
}

function Submit_Phrase() {
    //          Reset_Neurons(generic_triggers_layer);
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        Reset_Half_Charged_Neurons(layer);
    }

    document.getElementById("Result").innerHTML = "";
    var phrase = document.getElementById("Phrase").value;
    phrase = phrase.toLowerCase();
    var l = phrase.length - 1;
    var q = phrase.indexOf('?');

    Excite_Word(".");
    if (phrase == "") phrase = "*enter*";
    phrase = phrase.replace('?', ' ? ');
    Excite_Phrase(phrase);
    try {
        localStorage.removeItem(generic_triggers_layer.Name);

        Save_Neural_State(generic_triggers_layer);
        for (var i = 0; i < layers.length; i++) {
            Save_Neural_State(layers[i]);
        }
    } catch (Error) {}

    Show_Neural_State();
    check_Controls();
    document.getElementById("Phrase").value = "";
}

// NEURON'S FUNCTIONS
function Help() {
    Save_Neural_State(generic_triggers_layer);
    for (var i = 0; i < layers.length; i++) {
        Save_Neural_State(layers[i]);
    }
    //            window.open("http://www.256gl.com");
}

function Hello_World() {
    //            alert("Hello_World was activated!")
}

function Update_Node_Data(current_field, node_id, parm) {
    if (current_field == "Node_Name") Update_Node_Name(node_id, parm);
    if (current_field == "Triggers") Update_Triggers(node_id, parm);
    if (current_field == "Prompts") Update_Prompt(node_id, parm);
}

function Update_Node_Name(node_id, parm) {
    var arg = parm.value;
    r = /'/g;
    arg = arg.replace(r, "''");
    arg = encodeURIComponent(arg);
    var url = update_Node_Url + "&node_id=" + node_id + "&l_content=" + arg;
    var result = synch_XMLHttpRequest(url);
    change_name_callback(node_id, arg);
}

function Update_Triggers(node_id, parm) {
    var arg = parm.value;
    r = /'/g;
    arg = arg.replace(r, "''");
    arg = encodeURIComponent(arg);
    var url = update_Node_Url + "&node_id=" + node_id + "&n_triggers=" + arg;
    var result = synch_XMLHttpRequest(url);
}

function Update_Prompt(node_id, parm) {
    var arg = parm.value;
    r = /'/g;
    arg = arg.replace(r, "''");
    arg = encodeURIComponent(arg);
    var url = update_Node_Url + "&node_id=" + node_id + "&n_prompt=" + arg;
    var result = synch_XMLHttpRequest(url);
}

/// CALL BACKS
function ws_onOpen(msg) {}

function ws_onClose(msg) {
    // //           div.innerHTML = div.innerHTML + msg + '<br>';
    // document.getElementById('connectButton').style.background = "#cccccc";
    // document.getElementById('connectButton').value = "Connect";
}

function ws_onMessage(msg) {
    if (msg === "PONG" + ETX + "PING" || msg === "PING" + ETX + "PONG") return;
    msg = msg.replace(": ", ETX);
    var particles = msg.split(ETX);
    if (particles.length === 6) {
        if (particles[2] === 'BROADCAST') {
            ws_disconnect();
            session_id = particles[0]
            ws_connect()
        }
    }
    if (particles.length === 2) {
        if (particles[1] === 'DISCONNECTED') {
            ws_disconnect();
        } else {
            document.getElementById("Phrase").value = particles[1];
            Submit_Phrase();
        }
    }
}

function ws_onError(msg) {}

function ws_onLoad(msg) {}

/// CALLS

function ws_on_off(checked) {
    if (checked) {
        document.getElementById('qrcode').style.visibility = 'visible';
        qrcode.makeCode(header + "ws=" + ws_Server + "&session_id=" + session_id);
        msg = ws_iframe_api.ext_init(userId, token, session_id, ws_Server);
        if (msg != "0" && msg != undefined) {}
        connected = true;
    } else {
        ws_disconnect();
        connected = false;
        document.getElementById('qrcode').style.visibility = 'hidden';
    }
}

function ws_connect() {
    msg = ws_iframe_api.ext_init(userId, token, session_id, ws_Server);
    if (msg != "0" && msg != undefined) {
        connected = false;
        document.getElementById('qrcode').style.visibility = 'hidden';
    }
}

function ws_send_Q() {
    if (connected === false) return;
    msg = document.getElementById('qId').value;
    div.innerHTML = div.innerHTML + "<font color='blue'>" + msg + '</font><br>';
    ws_iframe_api.ext_send(userId + ETX + msg);
}

function ws_disconnect() {
    ws_iframe_api.ext_close();
    connected = false;
    document.getElementById('qrcode').style.visibility = 'hidden';
}

function random(n) {
    //    let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let a = "abcdefghijklmnopqrstuvwxyz1234567890"
    var s = ""
    for (i = 0; i < n; i++) {
        r = Math.floor(Math.random() * a.length);
        s = s + a.charAt(r);
    }
    return s;
}