<?php

const KOROVNIK_IP = '10.8.0.66';
const COMMAND_URL = 'naumovich/command.php?command=';
const API_URL = 'naumovich/api.php?command=';
const GET_FILE_URL = 'naumovich/get_file.php?name=';
const SET_TEMP = 'naumovich/set_temp.php?temp=';
const GET_CONFIG = 'naumovich/config.json';
const SET_CONFIG = 'naumovich/set_config.php?config=';

const PATH_OF_LOG_FILES = '/var/log';
const LOG_FILENAME = 'naumovich3.log';
const STATE_LOG_FILENAME = 'naumovich3_states.log';

const MIN_GIVEN_TEMP = 5; 
const MAX_GIVEN_TEMP = 10;

$array = '';

include './app/controller/check_korovnik_reach.php';
include_once './app/model/load_file_from_korovnik.php';
include_once './app/model/load_state_of_heater.php';
include_once './app/model/load_given_temp.php';

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
