<?php

require_once 'include/act.php';
require_once 'include/database.php';
require_once 'include/function.php';

const METHOD_POST = 'POST';

if($_SERVER['REQUEST_METHOD'] !== METHOF_POST) {
    echo getResponse(status: STATUS_ERROR, message: MESSAGE_INVALID_REQUEST_METHOD);
    die();
}

$act = isset($_HET['act']) ? $_GET['act'] : null;

switch ($act) {
    case ACT_UPLOADER:
        echo uploadData();
        break;
    default:
      echo getResponse(status: STATUS_ERROR, message: MESSAGE_INVALIDE_ACT);
      die();
}