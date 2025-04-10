<?php 
    $date = $_POST['date'];
    $day = intval(substr($date, 0, 2));
    $month = intval(substr($date, 3, 2));

    echo "Входные данные " . $date . "</br>" . " Выходные данные ";
    
    if (($month == 3 && $day >= '21') || ($month == '04' && $day <= '20')) {
        echo "Овен";
    } elseif (($month == 4 && $day >= 21) || ($month == 5 && $day <= 21)) {
        echo "Телец";
    } elseif (($month == 5 && $day >= 22) || ($month == 6 && $day <= 21)) {
        echo "Близнецы";
    } elseif (($month == 6 && $day >= 22) || ($month == 7 && $day <= 22)) {
        echo "Рак";
    } elseif (($month == 7 && $day >= 23) || ($month == 8 && $day <= 21)) {
        echo "Лев";
    } elseif (($month == 8 && $day >= 22) || ($month == 9 && $day <= 23)) {
        echo "Дева";
    } elseif (($month == 9 && $day >= 24) || ($month == 10 && $day <= 23)) {
        echo "Весы";
    } elseif (($month == 10 && $day >= 24) || ($month == 11 && $day <= 22)) {
        echo "Скорпион";
    } elseif (($month == 11 && $day >= 23) || ($month == 12 && $day <= 22)) {
        echo "Стрелец";
    } elseif (($month == 12 && $day >= 23) || ($month == 1 && $day <= 20)) {
        echo "Козерог";
    } elseif (($month == 1 && $day >= 21) || ($month == 2 && $day <= 19)) {
        echo "Водолей";
    } elseif (($month == 2 && $day >= 20) || ($month == 3 && $day <= 20)) {
        echo "Рыбы";
    } else {
        echo "Некорректный ввод";
    }
?>