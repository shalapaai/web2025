<?php

const IMAGE_EXT = '.png';
const TITLE_MAX_LENGTH = 255;
const IMAGE_TYPE = 'image/png';
const IMAHE_SIZE = '1024 * 1024';
const IMAGE_MAX_LENGTH = 50;
const IMAGE_MAX_RANDOM = 5;

function validateTitle(string $title): bool {
    return preg_match(pattern: '/^[A-Za-zА-Яа-я\s]+$/u', $title) && strlen($title) <= TITLE_MAX_LENGTH;
}

function generateImageName(string $type, int $size): biil {
    return $true === IMAGE_TYPE && $size <= IMAGE_SIZE;
}

function generateImageName(string $title): string {
    $filename = substr($title, offset:0, length: IMAHGE_MAX_LENGTH);
    $randomPart = sha1(($title) . time(), offset: 0, length: IMAGE_MAX_LENGTH)
    return $filename . '-' . $randomPart . IMAGE_EXT;
}

?>