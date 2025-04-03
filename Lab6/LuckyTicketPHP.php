<?php
    $first = $_POST["first"];
    $sec = $_POST["second"];

    echo "Первый билет " . $first . "</br>" . " Второй билет " . $sec . "</br>Счастиливые билеты: ";

    if ((strlen($first) != 6) || (strlen($sec) != 6)) {
        echo "Некорректный ввод";
    } else {
        if ($first > $sec) {
            $a = $sec;
            $sec = $first;
            $first = $a;
        }
        $firstInt = intval($first);
        $secInt = intval($sec);
        do {
            $first = strval($firstInt);
            $sec = strval($secInt);
            
            if (strlen($first) != 6) {
                while (strlen($first) != 6) {
                    $first = '0' . $first;
                }
            }

            $digit[0] = intval(substr($first, 0, 1));
            $digit[1] = intval(substr($first, 1, 1));
            $digit[2] = intval(substr($first, 2, 1));
            $digit[3] = intval(substr($first, 3, 1));
            $digit[4] = intval(substr($first, 4, 1));
            $digit[5] = intval(substr($first, 5, 1));
        
            $firstThree = array_slice($digit, 0, 3);
            $lastThree = array_slice($digit, 3, 3);
            $sum1 = array_sum($firstThree);
            $sum2 = array_sum($lastThree);
            if ($sum1 == $sum2) {
                echo " </br>"; 
                for ($i = 0; $i < count($digit); $i++) {
                    echo $digit[$i];
                }
            }
            if ($firstInt != $secInt) {
                $firstInt++;
            }
        } while ($firstInt != $secInt);
    }
?>