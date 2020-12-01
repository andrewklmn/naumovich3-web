<?php

    /* TODO 
     * get content of the /var/log/naumovich3_states.log from korovnik server
     * and convert it to JSON object
     */
       

    $string = explode('|', "2020-12-01|17:00:03|168430119|168430119|1|0|0|0|0|0|-0.6|10.2|8.6|20.0|18.5|0|1");
    
    $array['command'] = "week";
    $array['records'] = [
        $string,
    ];