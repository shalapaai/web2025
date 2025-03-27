<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>Ввод данных</title>
    </head>
    <body>
        <form method="POST">
            <input type="text" name="first">
            <input type="tet" name="second">
            <button type="submit">Отправить</button>
        </form>

        <?php
            $first = $_POST["first"];
            $sec = $_POST["second"];

            echo "Первый билет " . $first . "<br>" . " Второй билет " . $sec . "<br>Счастиливые билеты: ";

            $first = intval($first);
            $sec = intval($sec);

            if ($first > $sec) {
                $a = $sec;
                $sec = $first;
                $first = $a;
            }
            do {                
                $digit[0] = intdiv($first, 100000);
                $digit[1] = intdiv($first, 10000) % 10;
                $digit[2] = intdiv($first, 1000) % 10;
                $digit[3] = intdiv($first, 100) % 10;
                $digit[4] = intdiv($first, 10) % 10;
                $digit[5] = $first % 10;

                $firstThree = array_slice($digit, 0, 3);
                $lastThree = array_slice($digit, 3, 3);
                $sum1 = array_sum($firstThree);
                $sum2 = array_sum($lastThree);
                if ($sum1 == $sum2) {
                    echo " "; 
                    for ($i = 0; $i < count($digit); $i++) {
                        echo $digit[$i];
                    }
                }
                if ($first != $sec) {
                    $first++;
                }
            } while ($first != $sec)
        ?>
    </body>
</html>