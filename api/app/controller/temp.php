<?php

    $array['command'] = "temp";
    
    $temp = round($_REQUEST['temp']*10)/10;
    
    if($_REQUEST['temp'] < MIN_GIVEN_TEMP) $temp = MIN_GIVEN_TEMP;
    if($_REQUEST['temp'] > MAX_GIVEN_TEMP) $temp = MAX_GIVEN_TEMP;
    
    $array['stdout'] = shell_exec("php -f /var/www/html/naumovich/naumovich3.php " + $temp);
    $array['givenTemp'] = $temp;
