<?php 
    function digitToWord($digit) {
        $digitWords = [
            '0' => 'Ноль',
            '1' => 'Один',
            '2' => 'Два',
            '3' => 'Три',
            '4' => 'Четыре',
            '5' => 'Пять',
            '6' => 'Шесть',
            '7' => 'Семь',
            '8' => 'Восемь',
            '9' => 'Девять'
        ];
            
        return $digitWords[$digit];
    }

    $digit = $_POST["digit"];

    echo "Входные данные " . $digit . "</br>";

    $digit = digitToWord($digit);
    echo " Выходные данные " . $digit;
?>