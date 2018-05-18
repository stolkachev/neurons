<?php
$ETX = "\t";
$db = new SQLite3('256notes.db') or die('Unable to open database'); 
$result = $db->query('SELECT * FROM l_elements WHERE user_id = 1 ORDER BY l_id ASC') or die('Query failed');
$i = 1;
while ($row = $result->fetchArray())
{
    echo "{$row['id']}{$ETX}{$row['l_id']}{$ETX}{$row['type']}{$ETX}{$row['l_content']}{$ETX}{$row['x']}{$ETX}{$row['y']}\n";
    $i = $i + 1;
    if ($i > 100)break;
}
?>

