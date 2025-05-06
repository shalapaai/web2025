<?php include '../validate.php' ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Профиль</title>
    <link rel="stylesheet" href="style.css">
    <link href="/font.css" rel="stylesheet">
</head>
<body>
    <div class="menu-of-home">
        <div class="menu-of-home__image-home">
            <a href="/home/"><img src="marks/go-home.svg" alt="Вернуться"></a>
        </div>
        <div class="menu-of-home__image-my-account">
            <a href="/profile/?id=0874af11-e313-4e09-8c10-b233f293bf70"><img src="marks/my_account_active.svg" alt="Мой аккаунт"></a>
        </div>
        <div class="menu-of-home__image-of-new-post">
            <img src="marks/new-post.svg" alt="Новый пост"> 
        </div>
    </div>
    <div class="content">
        <?php include_once('profile_ex.php') ?>
    </div>
</body>
</html>