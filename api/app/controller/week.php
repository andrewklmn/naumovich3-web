<?php
    
    $array['command'] = "week";
    
    $state_log_content = load_file_from_korovnik(STATE_LOG_FILENAME);
    $array['records'] = explode("\n", $state_log_content);
    