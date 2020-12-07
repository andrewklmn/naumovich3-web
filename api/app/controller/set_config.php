<?php


   $url = 'http://'.KOROVNIK_IP.'/'.SET_CONFIG.$_REQUEST['set_config'];
   $array['url'] = $url;
    
   
   $array['answer'] = file_get_contents($url);