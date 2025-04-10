<?php
    function factorial(int $n): int {
        if ($n <= 1) {
            return 1;
        }
        return $n * factorial($n - 1);
    }
            
    $number = $_POST['number'];
    $number = intval($number);

    if ($number < 0) {
        echo "Факториал отрицательного числа не определен.";
    } else {
        $result = factorial($number);
        echo "Факториал числа {$number} равен: {$result}";
    }
?>