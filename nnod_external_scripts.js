var current_treshold = 0;
var search_Mode = 0;
var context_Only = 1;
var full_Text_Only = 2;
var mixed = 3;
var d_var1 = "test1";
var d_counter1 = 0;
var d_var2 = "";
var d_counter2 = 0;
var d_var3 = "";
var d_counter3 = 0;
var context_Choice = "";

var fuzzy_number = 0.5;
var fuzzy_value = 0.5;
var fuzzy_h = 0.5;
var fuzzy_m = 0.5;
var fuzzy_l = 0.5;

function unset_Context(contexts) {
    var splitContexts = contexts.split(",");
    excited_Nodes = slv_DialoqueEditor_Ctl.Content.SVL_DialogueEditor.Get_Excited_Nodes_CR();
    context_Choice = "";
    for (i = 0; i < splitContexts.length; i++) {
        if (excited_Nodes.indexOf(splitContexts[i]) < 0) {
            if (context_Choice == "") {
                context_Choice = splitContexts[i];
            } else {
                context_Choice = context_Choice + ", " + splitContexts[i];
            }
        }
    }
    return context_Choice;
};

function context_Search() {
    excited_Nodes = slv_DialoqueEditor_Ctl.Content.SVL_DialogueEditor.Get_Excited_Nodes_CR();
    var res = excited_Nodes.replace(/\n/g, ETX)
    return res;
};

function open_the_gate(l_element_id) {
    return l_element_id;
};

function Reset_Dialog_From_Starter(msg) {
    slv_DialoqueEditor_Ctl.Content.SVL_DialogueEditor.Reset_Dialog_From_Starter(msg);
};

function reset_Dialog() {
    // slv_DialoqueEditor_Ctl.Content.SVL_DialogueEditor.Reset_Context();
    //    alert("reset_Dialog")
};

function reset_Other_Tokens() {
    slv_DialoqueEditor_Ctl.Content.SVL_DialogueEditor.Reset_Other_Tokens();
};

/////////////////////////////////////////////////

function send_notification(phone) {
    user_id = get_User_ID();
    url = "/notes/clientbin/common/deepzoom/send_notification.aspx?session_id=" + "alexa-virtual" + "&phone=" + phone;
    document.getElementById("frm_controll").src = url;
};

function perform_script(str_script) {
    var innertext = "";
    var innerhtml = str_script.toLowerCase();
    script_start = innerhtml.indexOf("<script>");
    script_end = innerhtml.indexOf("script>", script_start + 2);

    if (script_start >= 0 && script_end >= 0) {
        innertext = str_script.substring(0, script_start);
        innertext = innertext + str_script.substring(script_end + 7, str_script.length);
        script = str_script.substring(script_start + 8, script_end - 2);
        eval(script);
        str_script = str_script.replace("%d_var1%", d_var1);
        str_script = str_script.replace("%context_Choice%", context_Choice);
    }
    return str_script;
};