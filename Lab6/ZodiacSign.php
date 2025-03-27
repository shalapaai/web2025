<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>Знак Зодиака</title>
    </head>
    <body>
        <form method="POST">
            <input type="text" name="date">
            <button type="submit">Отправить</button>
        </form>

        <?php 
            $date = $_POST['date'];
            $day = substr($date, 0, 2);
            $month = substr($date, 3, 2);

            echo "Входные данные " . $date . "<br>";
            echo " Выходные данные ";
        
            if (($month == '03' && $day >= '21') || ($month == '04' && $day <= '19')) {
                echo "Овен";
            } elseif (($month == '04' && $day >= '20') || ($month == '05' && $day <= '20')) {
                echo "Телец";
            }
            elseif (($month == '05' && $day >= '21') || ($month == '06' && $day <= '21')) {
                echo "Близнецы";
            }
            elseif (($month == '06' && $day >= '22') || ($month == '07' && $day <= '22')) {
                echo "Рак";
            }
            elseif (($month == '07' && $day >= '23') || ($month == '08' && $day <= '22')) {
                echo "Лев";
            }
            elseif (($month == '08' && $day >= '23') || ($month == '09' && $day <= '22')) {
                echo "Дева";
            }
            elseif (($month == '09' && $day >= '23') || ($month == '10' && $day <= '23')) {
                echo "Весы";
            }
            elseif (($month == '10' && $day >= '24') || ($month == '11' && $day <= '22')) {
                echo "Скорпион";
            }
            elseif (($month == '11' && $day >= '23') || ($month == '12' && $day <= '21')) {
                echo "Стрелец";
            }
            elseif (($month == '12' && $day >= '22') || ($month == '01' && $day <= '20')) {
                echo "Козерог";
            }   
            elseif (($month == '01' && $day >= '21') || ($month == '02' && $day <= '18')) {
                echo "Водолей";
            }
            elseif (($month == '02' && $day >= '19') || ($month == '03' && $day <= '20')) {
                echo "Рыбы";
            }
        ?>
    </body>
</html>