<?php 
    $digit = $_POST["digit"];

    echo "Входные данные " . $digit . "</br>" . " Выходные данные ";
    switch ($digit) {
        case '0':
            echo 'Ноль';
            break;
        case '1':
            echo 'Один';
            break;
        case '2':
            echo 'Два';
            break;
        case '3':
            echo 'Три';
            break;
        case '4':
            echo 'Четыре';
            break;
        case '5':
            echo 'Пять';
            break;
        case '6':
            echo 'Шесть';
            break;
        case '7':
            echo 'Семь';
            break;
        case '8':
            echo 'Восемь';
            break;
        case '9':
            echo 'Девять';
            break;
        
    }

?>