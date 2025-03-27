<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>Ввод данных</title>
    </head>
    <body>
        <form method="POST" action="">
            <input type="text" id="" name="year">
            <button type="submit">Отправить</button>
        </form>

        <?php
            function isLeapYear($year) {
                return ($year % 4 == 0 && $year % 100 != 0) || ($year % 400 == 0);
            }
            
            $year = $_POST["year"];
            echo 'Входные данные ' . $year . "<br>";
            echo 'Выходные данные ';
            if (isLeapYear($year)) {
                echo 'YES';
            } else {
                echo 'NO';
            }
        ?>
    </body>
</html>