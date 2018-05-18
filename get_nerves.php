<?php
$ETX = "\t";
$db = new SQLite3('256notes.db') or die('Unable to open database'); 
$all_links = $db->query('SELECT * FROM l_connections WHERE user_id = 1 ORDER BY id ASC') or die('Query failed');
while ($row = $all_links->fetchArray())
{
    echo "{$row['id']}\t";
    $result = $db->query("SELECT id FROM l_elements WHERE user_id = 1 AND type = '{$row['from_type']}' AND l_id = '{$row['from_id']}' ") or die('Query failed');
    if ($line = $result->fetchArray())
    {
        echo "{$line['id']}\t";
    }    
    $result = $db->query("SELECT id FROM l_elements WHERE user_id = 1 AND type = '{$row['to_type']}' AND l_id = '{$row['to_id']}' ") or die('Query failed');
    if ($line = $result->fetchArray())
    {
        echo "{$line['id']}\n";
    }
}
?>

