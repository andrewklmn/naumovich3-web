<?php

const KOROVNIK_IP = '10.8.0.66';
const COMMAND_URL = 'naumovich/command.php?command=';
const GET_FILE_URL = 'naumovich/get_file.php?name=';

const PATH_OF_LOG_FILES = '/var/log';
const LOG_FILENAME = 'naumovich3.log';
const STATE_LOG_FILENAME = 'naumovich3_states.log';

$array = '';

include './app/controller/check_korovnik_reach.php';
include_once './app/model/load_file_from_korovnik.php';

if ($array['korovnikIsAlive'] == true ) {
    include_once './app/model/get_controller_names_array.php';
    $commands = get_controller_names_array();
    foreach ($commands as $command) {
        if(isset($_REQUEST[$command])) {
            include './app/controller/'.$command.'.php';
            include './app/view/json_answer.php';
        }
    }    
}

include './app/controller/state.php';
include './app/view/json_answer.php';
