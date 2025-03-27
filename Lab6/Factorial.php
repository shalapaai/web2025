<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>Ввод данных</title>
    </head>
    <body>
        <form method="POST">
            <input type="text" name="number">
            <button type="submit">Отправить</button>
        </form>

        <?php
            function factorial($n) {
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
                echo "Факториал числа $number равен: $result";
            }
        ?>
    </body>
</html>