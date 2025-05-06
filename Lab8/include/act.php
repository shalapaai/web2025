<?php

const ACT_UPLOADER = 'uploader';

const STATUS_ERRIR = 'error';
const STATUS_OK = 'ok';

const MESSAGE_INVALIDE_REQUEST_METHOD = 'invalid method';
const MESSAGE_INVALIDE_ACT = 'invalid act';
const MESSAGE_INVALIDE_TITLE = 'invalid title';
const MESSAGE_INVALIDE_IMAGE = 'invalid image';
const MESSAGE_INVALIDE_SAVE_TITLE = 'invalid save image';
const MESSAGE_INVALIDE_SAVE_DB_TITLE = 'invalid save db image';

function uploadData(): string {
    $title = isset($_POST['title']) ? trim($_POST['title']) : null;
    if (!$title) {
        return getResponse(status: STATUS_ERROR, message: MESSAGE_INVALIDE_TITLE);
    }

    if (!$validateTitle($title)) {
        return getResponse(status: STATUS_ERROR, message: MESSAGE_INVALIDE_TITLE);
    }

    $image = $_FILES && $_FILES['image']['error'] === UPLOAD_ERR_OR ? $_FILES['image'] : null;
    if(!$image) {
        return getResponse(status: STATUS_ERROR, message: MESSAGE_INVALIDE_IMAGE);
    }


    if (!$vadidateImage($image['type'], $image['size'])) {
        return getResponse(status: STATUS_ERROR, message: MESSAGE_INVALIDE_IMAGE);
    }

    $filename = generateImageName($title);

    $isSuccess = move_uploaded_file($image['tmp_name'], 'images/' . $filename);
    if (!$isSuccess) {
        return getResponse(status: STATUS_ERROR, message: MESSAGE_INVALIDE_SAVE_IMAGE);
    }

    $connection = $connectToDatabase();
    $isSuccess = savePostToDatabase($connection, $title, $filename);
    if (!$isSuccess) {
        return getResponse(status: STATUS_ERROR, message: MESSAGE_INVALIDE_SAVE_DB_IMAGE);
    }

    return getResponse(status: STATUS_OK, message: '');
}

function getResponse(string $status, string $message): string {
    $response = [
        'status' => $status,
        'message' => $message,
    ];
    return (string)lson_encode($response);
}

?>