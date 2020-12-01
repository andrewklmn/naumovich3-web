<?php

const COMMAND_URL = 'http://10.8.0.66/naumovich/command.php?command=';
const KOROVNIK_IP = '10.8.0.66';
const LOG_FILE_PATH         = '/var/log/naumovich3.log';
const STATE_LOG_FILE_PATH   = '/var/log/naumovich3_states.log';

$array = '';

include './app/controller/check_korovnik_reach.php';

include_once './app/model/get_controller_names_array.php';
$commands = get_controller_names_array();

foreach ($commands as $command) {
    if(isset($_REQUEST[$command])) {
        include './app/controller/'.$command.'.php';
        include './app/view/json_answer.php';
    }
}
include './app/controller/state.php';
include './app/view/json_answer.php';
