
<?php
function renderPost(array $post, $user, $images)
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
            
            <img class="post__edit-post"src="../image/edit.svg" alt="редактировать"> 
        </div>     
                <img class="post__image" src="<?php echo '../image' . $images['image_path'] ?>" alt="фото поста"> 
        <button class="post__like-button">
            <img class="post__like-image" src="../image/like.svg" alt="символ лайка"> 
            <p class="post__like-count"><?php echo $post['likes'] ?></p>
        </button>
        <p class="post__text"><?php echo $post['content'] ?></p>
        <p class="post__text-add">еще</p>
        <p class="post__time"><?php echo date('d.m.Y H:i', strtotime($post['created_at'])); ?></p>
    </div>
<?php
}
?>