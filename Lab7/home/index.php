<?php include '../validate.php' ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Главная</title>
    <link href="styles.css" rel="stylesheet">
    <link href="font.css" rel="stylesheet">
</head>
<body>
    <div class="menu-of-home">
        <div class="image-home">
            <a href="/home/"><img src="marks/go-home.svg" alt="Вернуться"></a>
        </div>
        <div class="image-my-account">
            <a href="/profile/?id=1"><img src="marks/my_account.svg" alt="Мой аккаунт"></a>
        </div>
        <div class="image-of-new-post">
            <img src="marks/new-post.svg" alt="Новый пост"> 
        </div>
    </div>
    <div class="content">
        <div class="post">  
            <?php include_once('post_ex.php') ?>   
        </div>
    </div>
</body>
</html>