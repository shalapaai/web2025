<?php
    function isLeapYear(int $year): bool {
        return ($year % 4 == 0 && $year % 100 != 0) || ($year % 400 == 0);
    }
            
    $year = $_POST["year"];
    echo 'Входные данные ' . $year . "</br>";
    echo 'Выходные данные ';
    if (isLeapYear($year)) {
        echo 'YES';
    } else {
        echo 'NO';
    }
?>