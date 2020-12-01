<?php
    

    $state_log_content = load_file_from_korovnik(STATE_LOG_FILENAME);

    
    $array['command'] = "week";
    $array['records'] = explode("\n", $state_log_content);
    