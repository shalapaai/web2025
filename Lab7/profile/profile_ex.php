 
<div class="about-user">
    <div class="user-main-info">
        <img class="user-main-info__avatar-in-profile" src="<?php echo $user['user_avatar'] ?>" alt="Аватар">
        <p class="user-main-info__name-of-user"><?php echo $user['name'] ?></p>
        <p class="user-main-info__description-of-user"><?php echo $user['status'] ?></p>
    </div>
    <div class="number-of-post">
        <img class="number-of-post__icon-of-gallery" src="marks/Posts.svg" alt="Посты">
        <span class="number-of-post__counter"><?php echo $counter_posts ?> постов</span>
    </div>
</div>
<div class="all-posts">
    <?php
        for ($i = 0; $i < $counter_posts; $i++) {
            echo "<img src='" . $post_images[$i] . "' alt='Фото из поста'>";
        }
    ?>
</div>