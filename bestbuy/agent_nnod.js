    var slv_Zoom_Ctl = null;
    var req;
    var session_id = "<%=session_id%>";

    var ws_Chat_session_id = session_id;

    var chat_Status = "CHAT_OFF";

    var device_id = "<%=device_id%>";
    var remote_control = "<%=remote_control%>";

    var DuplexServerHost = "<%=DuplexServerHost%>";
    var DuplexServerPort = "<%=DuplexServerPort%>";
    var ws;
    var ws_Chat;
    var ETB = '\x17';

    var SocketCreated = false;
    var ws_Chat_SocketCreated = false;

    window.onbeforeunload = function() {
        try {
            ws.close();
            ws_Chat.close();
        } catch (Error) {}
    };

    if (remote_control == "true") {
        try {
            ws = new WebSocket("ws://256gl.azurewebsites.net");
            SocketCreated = true;
            ws.onopen = WSonOpen;
            ws.onmessage = WSonMessage;
            ws.onclose = WSonClose;
        } catch (Error) {}
    }
    /*
        try {
            ws_Chat = new WebSocket("ws://256gl.azurewebsites.net");
            ws_Chat.onopen = WS_Chat_Оn_Open;
            ws_Chat.onmessage = WS_Chat_Оn_Message;
            ws_Chat.onclose = WS_Chat_Оn_Close;
        } catch (Error) {
            alert(Error)
        }
    */
    function WS_Chat_Оn_Open() {
        ws_Chat.send("Session_Id=" + ws_Chat_session_id);
        setInterval(function() { ws_Chat.send("PONG" + ETB) }, 10000);
    };

    function WS_Chat_Оn_Message(event) {
        ws_Chat_SocketCreated = true;
        msg = event.data;
        var segments = event.data.split("\n");
        for (var i = 0; i < segments.length; i++) {
            var parms = segments[i].split(ETB);
            if (parms[0] == "PONG") {
                if (parms[1] == "CONNECTED") {
                    chat_Status = "CHAT_ON";
                } else {
                    if (chat_Status == "CHAT_ON") {
                        msg = "<font color=blue>&gt;Disconnected</font>";
                        parent.frm_agent.set_answer(msg);
                        parent.frm_agent.setCursorAtEnd();
                    }
                    chat_Status = "CHAT_OFF";
                }
            }
            if (parms[0] == "MESSAGE") {
                if (parms[1].indexOf("user: ") != 0) {
                    if (parms[1] == "Connected" || parms[1] == "Disconnected") {
                        msg = "<font color=blue>&gt;" + parms[1] + "</font>";
                    } else {
                        msg = "<font color=red>&gt;" + parms[1] + "</font>";
                    }
                    parent.frm_agent.set_answer(msg);
                    parent.frm_agent.setCursorAtEnd();
                }
            }
            if (parms[0] == "MESSAGECONTINUE") {
                if (parms[1].indexOf("user: ") != 0) {
                    msg = "<font color=red>&gt;" + parms[1] + "</font>";
                    parent.frm_agent.set_answer(msg);
                    parent.frm_agent.setCursorAtEnd();
                }
            }

            if (parms[0] == "COMMAND") {
                if (parms[1].indexOf("CHAT_ON") == 0) {
                    chat_Status = "CHAT_ON";
                }
                if (parms[1].indexOf("CHAT_OFF") == 0) {
                    chat_Status = "CHAT_OFF";
                }
            }
        }
    };

    function WS_Chat_Оn_Close() {
        ws_Chat_SocketCreated = false;
    };

    function sendMessage(msg) {
        if (!ws_Chat_SocketCreated) return;
        try {
            var txt = msg;
            txt = txt.replace(/\[:/g, ':');
            txt = txt.replace(/\] /g, ' ');
            if (txt.length < 80) {
                ws_Chat.send("MESSAGE" + ETB + txt);
            } else {
                var txt1 = txt.substring(0, 60);
                var txt2 = txt.substring(61, txt.length);
                ws_Chat.send("MESSAGE" + ETB + txt1);
                ws_Chat.send("MESSAGECONTINUE" + ETB + txt2);
            }
        } catch (Error) {
            alert(Error)
        }
    }

    function WSonOpen() {
        ws.send("Session_Id=" + session_id);
    };

    function WSonMessage(event) {
        msg = event.data;
        var coordinates = "";
        var segments = event.data.split("\n");
        for (i = 0; i < segments.length; i++) {
            var parms = segments[i].split(":");
            if (parms[0].toLowerCase() != "") {
                ws.send("OK");
                if (parms[1].toLowerCase() == "reset") {
                    reset_search_Remote();
                } else {
                    if (parms[1].toLowerCase().indexOf("looking for ") >= 0) {
                        if (parms[1].toLowerCase().indexOf(" car") >= 0) {
                            top.location.href = "/notes/ClientBin/common/deepzoom/index.aspx?user_id=121&remote_control=true&device_id=121&session_id=my_virtual";
                        }
                        if (parms[1].toLowerCase().indexOf(" camera") >= 0) {
                            top.location.href = "/notes/ClientBin/common/deepzoom/index.aspx?user_id=58&remote_control=true&device_id=58&session_id=my_virtual";
                        }
                        if (parms[1].toLowerCase().indexOf(" art") >= 0) {
                            top.location.href = "/notes/ClientBin/common/deepzoom/index.aspx?user_id=39&remote_control=true&device_id=39&session_id=my_virtual";
                        }
                        if (parms[1].toLowerCase().indexOf(" movie") >= 0) {
                            top.location.href = "/notes/ClientBin/common/deepzoom/index.aspx?user_id=53&remote_control=true&device_id=53&session_id=my_virtual";
                        }
                        if (parms[1].toLowerCase().indexOf(" shampoo") >= 0) {
                            top.location.href = "/notes/ClientBin/common/deepzoom/index.aspx?user_id=28&remote_control=true&device_id=28&session_id=my_virtual";
                        }
                        if (parms[1].toLowerCase().indexOf(" hair") >= 0) {
                            top.location.href = "/notes/ClientBin/common/deepzoom/index.aspx?user_id=32&remote_control=true&device_id=32&session_id=my_virtual";
                        }
                        if (parms[1].toLowerCase().indexOf(" food") >= 0) {
                            top.location.href = "/notes/ClientBin/common/deepzoom/index.aspx?user_id=64&remote_control=true&device_id=64&session_id=my_virtual";
                        }
                    } else {
                        Get_Answer_Remote(parms[1]);
                    }
                }
            }
            if (parms[0] == "CURSOR") {
                coordinates = coordinates + parms[1] + ":";
                slv_Zoom_Ctl.Content.SVL_Deep_Zoom.Remote_Mouse(parms[1]);
            }
            if (parms[0] == "CURSOREND") {
                slv_Zoom_Ctl.Content.SVL_Deep_Zoom.Remote_Mouse_End();
            }
            if (parms[0] == "CURSORCLICK") {
                slv_Zoom_Ctl.Content.SVL_Deep_Zoom.Remote_Mouse_Click();
            }
        }
    };

    function WSonClose() {
        SocketCreated = false;
    };