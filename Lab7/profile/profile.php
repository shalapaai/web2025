<?php
function renderProfile(array $posts, $user)
{
    ?> 
    <div class="user-main-info">
        <img class="avatar-in-profile" src=<?php echo "../image/" . $user['user_avatar']; ?> alt="Аватар">
        <p class="name-of-user"><?php echo $user['name']?></p>
        <p class="description-of-user"><?php echo $user['status']?></p>
        <div class="number-of-post">
            <img class="number-of-post__icon-of-gallery" src="../image/Posts.svg" alt="Посты">
            <span class="number-of-post__counter"><?php echo count($posts) . ' постов' ?></span>
        </div>
    </div>
    <div class="all-posts">
        <?php   
            foreach ($posts as $post) {
                ?>
                <img class="all-posts__image" src=<?php echo "../image/" . ($post['images'])[0]; ?> alt="изображение">
                <?php
            }
        ?>
    </div>
<?php
}
?>

