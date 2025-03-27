<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>Ввод данных</title>
    </head>
    <body>
        <form method="POST">
            <input type="text" name="expression">
            <button type="submit">Отправить</button>
        </form>

        <?php            
            $expression = $_POST['expression'];
            $number = intval($number);
            
        ?>
    </body>
</html>