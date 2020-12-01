<?php

require_once './app/model/is_ip_alive.php';

if (is_IP_alive(KOROVNIK_IP)) {
    $array['korovnikIsAlive'] = true;
} else {
    $array['korovnikIsAlive'] = false;
    $array['error'][] = 'Korovnik is not online!';
};
