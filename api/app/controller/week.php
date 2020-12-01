<?php
    
    $string = explode('|', "2020-12-01|17:00:03|168430119|168430119|1|0|0|0|0|0|-0.6|10.2|8.6|20.0|18.5|0|1");
    
    $array['command'] = "week";
    $array['records'] = $states_file;
    
    load_file_from_korovnik(STATE_LOG_FILE_PATH);