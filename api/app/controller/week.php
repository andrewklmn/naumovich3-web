<?php
    
    $array['command'] = "week";
    
    $date = new DateTime(date());
    $date->modify('+1 hour');
    $array['todayDate'] = $date->format('Y-m-d H:i:s');;
    $date->modify('-7 day');
    $array['startDate'] = $date->format('Y-m-d H:i:s');;
    
    $today = explode(" ", $array['todayDate']);
    $start_day = explode(" ", $array['startDate']);
    
    $state_lines = explode("\n", load_file_from_korovnik(STATE_LOG_FILENAME));
    
    foreach ($state_lines as $line) {
        if ( (substr($line,0,10) == $start_day[0] AND substr($line,11,8) >= $today[1])
                OR (substr($line,0,10) > $start_day[0] AND substr($line,0,10) < $today[0])
                OR (substr($line,0,10) == $today[0] AND substr($line,11,8) <= $today[1])) {
            $array['records'][] = $line;         
        }
    }
    