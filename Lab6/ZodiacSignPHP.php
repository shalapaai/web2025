<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['date'])) {
    $dateString = trim($_POST['date']);
    $result = getZodiacSign($dateString);   
    echo 'Дата: ' . $dateString . '</br>';
    echo 'Знак зодиака: ' . $result;
}

function getZodiacSign($dateString) {
    $day = 0;
    $month = 0;
    $found = false;
    
    // DD.MM.YYYY 
    if (strpos($dateString, '.') !== false) {
        $datesArr = explode('.', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD,MM,YYYY 
    if (strpos($dateString, ',') !== false) {
        $datesArr = explode(',', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD/MM/YYYY 
    elseif (strpos($dateString, '/') !== false) {
        $datesArr = explode('/', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD|MM|YYYY 
    elseif (strpos($dateString, '|') !== false) {
        $datesArr = explode('|', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD-MM-YYYY 
    elseif (strpos($dateString, '-') !== false) {
        $datesArr = explode('-', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD_MM_YYYY 
    elseif (strpos($dateString, '_') !== false) {
        $datesArr = explode('_', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD#MM#YYYY 
    elseif (strpos($dateString, '#') !== false) {
        $datesArr = explode('#', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD&MM&YYYY 
    elseif (strpos($dateString, '&') !== false) {
        $datesArr = explode('&', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DD MM YYYY
    elseif (strpos($dateString, ' ') !== false) {
        $datesArr = explode(' ', $dateString);
        if (count($datesArr) == 3) {
            $day = (int)$datesArr[0];
            $month = (int)$datesArr[1];
            $found = true;
        }
    }
    // DDMMYYYY 
    elseif (is_numeric($dateString) && strlen($dateString) == 8) {
        $day = (int)substr($dateString, 0, 2);
        $month = (int)substr($dateString, 2, 2);
        $found = true;
    }
    
    if ($month > 12 && $day <= 12) {
        $a = $month;
        $month = $day;
        $day = $a;
    }
    
    if (!$found) {
        return "Что-то пошло не так";
    }
    
    if ($month < 1 || $month > 12) {
        return "Неправильный формат месяца";
    }
    if ($day < 1 || $day > 31) {
        return "Неправильный формат дня";
    }
    
    if (($month == 1 && $day >= 20) || ($month == 2 && $day <= 18)) {
        return "Водолей";
    } elseif (($month == 2 && $day >= 19) || ($month == 3 && $day <= 20)) {
        return "Рыбы";
    } elseif (($month == 3 && $day >= 21) || ($month == 4 && $day <= 19)) {
        return "Овен";
    } elseif (($month == 4 && $day >= 20) || ($month == 5 && $day <= 20)) {
        return "Телец";
    } elseif (($month == 5 && $day >= 21) || ($month == 6 && $day <= 20)) {
        return "Близнецы";
    } elseif (($month == 6 && $day >= 21) || ($month == 7 && $day <= 22)) {
        return "Рак";
    } elseif (($month == 7 && $day >= 23) || ($month == 8 && $day <= 22)) {
        return "Лев";
    } elseif (($month == 8 && $day >= 23) || ($month == 9 && $day <= 22)) {
        return "Дева";
    } elseif (($month == 9 && $day >= 23) || ($month == 10 && $day <= 22)) {
        return "Весы";
    } elseif (($month == 10 && $day >= 23) || ($month == 11 && $day <= 21)) {
        return "Скорпион";
    } elseif (($month == 11 && $day >= 22) || ($month == 12 && $day <= 21)) {
        return "Стрелец";
    } elseif (($month == 12 && $day >= 22) || ($month == 1 && $day <= 19)) {
        return "Козерог";
    }
}
?>