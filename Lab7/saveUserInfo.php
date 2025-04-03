<?php
    $users = json_decode(file_get_contents('users.json'), true);
    $posts = json_decode(file_get_contents('posts.json'), true);

    $user_id = isset($_GET['id']) ? (int)$_GET['id'] : 1;

    $current_user = null;
    foreach ($users as $user) {
        if ($user['id'] == $user_id) {
            $current_user = $user;
            break;
        }
    }

    if (!$current_user) {
        header("Location: home.php");
        exit;
    }

    $user_posts = array_filter($posts, function($post) use ($user_id) {
        return $post['user_id'] == $user_id;
    });
?>