<?php

function is_IP_alive($ip) {
    $pingresult = exec("ping -c2 -w2 $ip", $outcome, $status);
    if (0 == $status) {
        return true;
    }
    return false;
}

