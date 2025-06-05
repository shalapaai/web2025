
<?php
function renderPost(array $post, $users, $user, $images)
{ 
?>
    <div class="post">
        <div class="post__header">
            <a href=<?php echo '../profile?id=' . $user['id'] ?>>
                <img class="post__avatar" src=<?php echo "../image/" . $user['user_avatar'] ?> alt="аватар"> 
            </a>  
            <a class="post__username" href=<?php echo '../profile?id=' . $user['id'] ?>>                
                <span><?php echo $user['name']?></span>
            </a> 
            <?php if ($user['id'] == $users[0]['id']) { ?>      
                <img class="post__edit-post"src="../image/edit.svg" alt="редактировать"> 
            <?php } ?>
        </div>  
        <div class="post__images">
            <?php foreach ($images as $image) { ?>
                <img class="post__image" src="<?php echo '../image' . $image['image_path'] ?>" alt="фото поста">
            <?php } 
            if (count($images) != 1) { ?>
            <img class="post__slider post__slider_left" src="../image/slider_button_left.svg" alt="слайдер">
            <img class="post__slider post__slider_right" src="../image/slider_button_right.svg" alt="слайдер">
            <div class="post__counter"><span></span></div>
            <?php } ?>
        </div>
        <button class="post__like-button">
            <img class="post__like-image" src="../image/like.svg" alt="символ лайка"> 
            <p class="post__like-count"><?php echo $post['likes'] ?></p>
        </button>
        <p class="post__text"><?php echo $post['content'] ?></p>
        <button class="post__text-add">еще</button>
        <p class="post__time"><?php echo date('d.m.Y H:i', strtotime($post['created_at'])); ?></p>
    </div>
<?php
}
?>