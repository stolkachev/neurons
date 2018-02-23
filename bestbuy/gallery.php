<!DOCTYPE HTML>

<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, initial-scale=1.0" />
<meta name="viewport" content="user-scalable=yes">

<title>256gl NNOD</title>
<link rel="stylesheet" type="text/css" href="style.css" />
<script type="text/javascript">
function openThumbnailLink(url)
{
    window.open(url, "_blank", "toolbar=no, scrollbars=yes, resizable=yes, top=10, left=10, width=800, height=800");
    return true;
};
</script>
</head>
<body style="background-color:#999999;">

<?php
$url = "https://api.bestbuy.com/v1/products(customerReviewAverage>=4&regularPrice>100&regularPrice<300&(categoryPath.id=abcat0401000))?apiKey=7ksBhjryZ5hxofJSEk2VBO7u&sort=name.asc&show=manufacturer,name,image,url,regularPrice&facet=regularPrice,50&pageSize=100&format=json";

$data = file_get_contents($url);
$json = json_decode($data, true);

// echo $json["total"] . '<br>';
$array = $json["products"];
$db_counter = 1;
foreach ($array as $obj) { 
    $db_counter = $db_counter + 1;
//    echo $obj['name'] . $db_counter .'<br>';
//    echo $obj['image'] . '<br>';
//    echo $obj['url'] . '<br>';

    echo "<div class=\"thumbnail_wrapper\"><table cellspacing=\"0\" cellpadding=\"0\"><tr>\n" .
    "<td id=\"td_thumbnail_" . $db_counter . "\" class=\"td_thumbnail_image\">\n" .
    "<a href=\"#\"><img src=\"" . $obj['image']  . "\" height='70' width='95' " .
    "\" onclick=\"javascript:openThumbnailLink('" . $obj['url'] . "'); return false;\"></a></td>\n" .
    "</tr><tr><td id=\"td_thumbtitle_" . db_counter . "\" class=\"td_thumbnail_title\">\n" . " " . $obj['name'] . "\n" .
    "</td></tr></table></div> \n\n";
}
?>
</body>
</html>
