<?php
    $post_file = file_get_contents("../data/posts.json", true);
    $user_file = file_get_contents("../data/users.json", true);
    $posts = json_decode($post_file, true);
    $users = json_decode($user_file, true);

    $user_id = strval(isset($_GET['id']) ? (int)$_GET['id'] : 1);

    $found_id = false;
    foreach ($users as $user) {
        if ($user['id'] == $user_id) {
            $found_id = true;
            break;
        }
    }

    if (!$found_id) {
        header("Location: /home/");
        exit();
    }

    if ($user_id == null) {
        header("Location: /home/");
        exit();
    } 

    $post_images = [];
    $counter_posts = null;
    foreach ($posts as $post) {
        if ($post['autor_id'] == $user['id'] && !empty($post['images'])) {
            $post_images = array_merge($post_images, $post['images']);
            $counter_posts++;
        }
    }

?>