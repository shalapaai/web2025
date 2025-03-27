<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Ввод данных</title>
</head>
<body>
    <form method="POST" action="">
        <input type="text" id="" name="digit">
        <button type="submit">Отправить</button>
    </form>

    <?php 
        $digit = $_POST['digit'];
        echo "Входные данные " . $digit . "<br>";
        echo " Выходные данные ";
        if ($digit == 1) {
            echo "Один";
        } elseif ($digit == 2) {
            echo "Два";
        } elseif ($digit == 3) {
            echo "Три";
        } elseif ($digit == 4) {
            echo "Четыре";
        } elseif ($digit == 5) {
            echo "Пять";
        } elseif ($digit == 6) {
            echo "Шесть";
        } elseif ($digit == 7) {
            echo "Семь";
        } elseif ($digit == 8) {
            echo "Восемь";
        } elseif ($digit == 9) {
            echo "Девять";
        }        
    ?>
</body>
</html>