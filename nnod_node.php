<?php
$u_id = $_GET['u_id'];
$node_id = $_GET['node_id'];
$ETX = "\t";
$db = new SQLite3('../256notes.db') or die('Unable to open database'); 
$sql = "SELECT * FROM l_elements where id = " . $node_id . " and user_id = " . $u_id;
$results = $db->query($sql) or die('Query failed');
while ($row = $results->fetchArray())
{
    $l_name = $row['l_name'];
    $l_content = $row['l_content'];
    $n_prompt = $row['n_prompt'];
    $n_triggers = $row['n_triggers'];
    $n_states = $row['n_states'];
}
?>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>256notes Triggerss</title>
</head>

<body bgcolor="lightgray">
    <link rel="stylesheet" href="NNT.css" type="text/css" />

    <script type="text/javascript">

        var u_id = "<?php echo $u_id;?>";
        var node_id = "<?php echo $node_id;?>";
        var update_Node_Name_Url = "/slq_update_Node_Name.php?u_id=" + u_id + "&node_id=" + node_id;

        function synch_XMLHttpRequest(url) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
            var result = xmlHttp.responseText;
            return result;
        }

        function Update_Node_Name(V) {
            l_content = V.value;
            r = /'/g;
            l_content = l_content.replace(r, "''");
            l_content = encodeURIComponent(l_content);
            var url = update_Node_Name_Url +"&l_content=" + l_content;
            var result = synch_XMLHttpRequest(url);
            slq_update_Node_Name.php
         //   parent.nnt_card_Control.location.href = URL;
         
        }

        function Update_Triggers(V) {
            n_triggers = V.value;
            r = /'/g;
            n_triggers = n_triggers.replace(r, "''");
            n_triggers = encodeURIComponent(n_triggers);
            URL = "Update_Starters_Triggers.aspx?ID=164&user_ID=1" + "&n_triggers=" + n_triggers;
            parent.nnt_card_Control.location.href = URL;
        }

        function Update_Prompt(V) {
            n_prompt = V.value;
            r = /'/g;
            n_prompt = n_prompt.replace(r, "''");
            n_prompt = encodeURIComponent(n_prompt);
            URL = "Update_Starters_Prompt.aspx?ID=164&user_ID=1" + "&n_prompt=" + n_prompt;
            parent.nnt_card_Control.location.href = URL;
        }

        function prev_card() {
            URL = "starter.aspx?ID=1&Direction=L&user_ID=1";
            parent.nnt_card_top.location.href = URL;
        }

        function next_card() {
            URL = "starter.aspx?ID=1&Direction=R&user_ID=1";
            parent.nnt_card_top.location.href = URL;
        }

        function first_card() {
            URL = "starter.aspx?ID=0" +
                "&Direction=R&user_ID=1";
            parent.nnt_card_top.location.href = URL;
        }

        function last_card() {
            URL = "starter.aspx?ID=1000000" +
                "&Direction=L&user_ID=1";
            parent.nnt_card_top.location.href = URL;
        }

        function Adjust_Triggers() {
            words = document.getElementById("Triggers").value;
            r = /'/g;
            words = words.replace(r, "''");
            words = encodeURIComponent(words);
            URL = "adjust_triggers.aspx?user_ID=1&words=" + words;
            window.open(URL, "256notes_adjust_triggers", "width=600,height=450,top=50,left=160,scrollbars=1,location=1,resizable=1,status=1");
        }

        function microsoftKeyPress() {
            if (window.event.keyCode == 37) prev_card();
            if (window.event.keyCode == 38) first_card();
            if (window.event.keyCode == 39) next_card();
            if (window.event.keyCode == 40) last_card();
        }

        function New_Starter() {
            window.top.add_new_starter();
        }
    </script>

    <table border="0" width="100%" height="5%">

        <th align="left" width="8%">
            <B><font color=blue><?php echo $node_id; ?></font></th>

    <th align="center" width="60%">
    <textarea id="Node_Name" align="center" onchange="Update_Node_Name(this);"
         style="height:30; width:70%; background-color:lightgray; color:blue; font-family: 'Times New Roman'; 
         font-size:14pt; font-weight:bold; border:0; resize:none;"><?php echo $l_content;?></textarea>
        </th>

    
    </table>
    
    <hr size=1 align="left">
    <table border="0" width="100%" height="10%">
    <tr>
    <th align="left"><font color='#417c64'>Linguistic triggers</font></th>
    </tr>
    <tr>
    <td align="left"><textarea id="Triggers" align="left" style='height:40; width:100%;background-color:white; overflow=auto; font-family:verdana; font-size:8pt;' 
    onchange='Update_Triggers(this);'><?php echo $n_triggers; ?></textarea>
    
    </td>
    </tr>
    <tr>
    <th align="left"><font color='#417c64'>Prompts</font></th>
    </tr>
    </table>
    
    <style type="text/css"> 
    textarea {width: 100%; height: 100%} 
    </style> 
    
    <table border="0" width="100%" height="60%">
    
    <tr>
    <td align="left">
    <div style='height: 100%; width: 100%'>
    <textarea id="Triggers" align="left" style='width:100%;background-color:white; overflow=auto; font-family:verdana; font-size:8pt;' 
    onChange='Update_Prompt(this);'><?php echo $n_prompt; ?></textarea>
    </div>
    </td>
    </tr>
    </table>
    
    <hr size=1 align="left">
    <table border="0" width="100%" height=5%>
    <tr align="left">
    <td align="center" width="10%"><input type="button" value="Adjust Triggers" onclick="Adjust_Triggers()" /></td>
    </tr>
    </table>
    <script type="text/javascript">
    self.focus();
    </script>
    </body>
    </html>