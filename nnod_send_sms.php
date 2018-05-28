<?php
$phone = $_GET['phone'];
$response = file_get_contents("http://256gl.com/notes/clientbin/common/deepzoom/send_notification.aspx?session_id=d-elegance&phone=" . $phone);
echo $response
?>