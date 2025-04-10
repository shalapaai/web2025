<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Профиль</title>
    <link rel="stylesheet" href="profile.css">
    <link href="/font.css" rel="stylesheet">
</head>
<body>
    <?php
        $post_file = file_get_contents("../data/posts.json", true);
        $user_file = file_get_contents("../data/users.json", true);
        $posts = json_decode($post_file, true);
        $users = json_decode($user_file, true);

        $user_id = isset($_GET['id']) ? (int)$_GET['id'] : 1;

        $current_user = null;
        foreach ($users as $user) {
            if ($user['id'] == $user_id) {
                $current_user = $user;
                break;
            }
        }
        
        $post_images = [];
        $current_post = null;
        foreach ($posts as $post) {
            if ($current_user == $post['user_id']) {
                $current_post = $post;
                $post_images.push($current_post['image']);
                array_push($post_images, $current_post['image']);
            }
        }
        
    ?>
    <div class="menu-of-home">
        <div class="image-home">
            <img src="marks/go-home.svg" alt="Вернуться">
        </div>
        <div class="image-my-account">
            <img src="marks/my_account_active.svg" alt="Мой аккаунт">
        </div>
        <div class="image-of-new-post">
            <img src="marks/new-post.svg" alt="Новый пост"> 
        </div>
    </div>
    <div class="posts">
        <div class="about-user">
            <div class="user-name">
                <img class="avatar-in-profile" src="avatar_images/vanya.png" alt="Аватар">
                <p class="name-of-user"><?php echo $current_user['name'] ?></p>
                <p class="description-of-user"><?php echo $current_user['status'] ?></p>
<!--
                <p class="description-of-user">Дата регистрации: 
                    <?= date('d.m.Y', $current_user['registered_at']) ?>
                </p>
-->
            </div>
            <div class="number-of-post">
                <img class="icon-of-gallery" src="marks/Posts.svg" alt="Посты">
                <span class="number"><?php echo $current_user['post_cnt'] ?> поста</span>
            </div>
        </div>
        <div class="all-posts">
            <img src="<?php echo $post_images[0] ?>" alt="Фото из поста">
            <img src="posts_images/photo2.png" alt="Фото из поста">
            <img src="posts_images/photo3.png" alt="Фото из поста">
            <img src="posts_images/photo4.png" alt="Фото из поста">
            <img src="posts_images/photo5.png" alt="Фото из поста">
            <img src="posts_images/photo6.png" alt="Фото из поста">
        </div>
    </div>
</body>
</html>