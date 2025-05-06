<?php foreach ($posts as $post) {      
    foreach ($users as $user) { 
        if ($user['id'] == $post['autor_id']) { ?>   
            <a href="/profile/?id=<?php echo $user['id'] ?>">                   
                <img class="avatar" src="<?php echo $user['user_avatar'] ?>" alt="Аватар">
                <span class='user-name'><?php echo $user['name'] ?></span>
            </a>
            <?php if ($user['id'] == 1) echo "<img src='marks/edit.svg' alt='Изменить'>" ?>
            <div class='main'>
                <img class='post-image' src='<?php foreach ($post['images'] as $image) echo $image ?>' alt='Фото из поста' width='475'>
                <div class='likes'>
                    <img class='like-image' src='marks/like.svg' alt='Лайк'>
                    <span class='likes-counter'><?php echo $post['likes'] ?></span>
                </div>
                <p class='post-info'><?php echo $post['content'] ?></p>
                <p class='post-time'><?php echo date('d.m.Y', $post['created_at']) ?></p>
            </div>  
        <?php }
    } 
} ?>