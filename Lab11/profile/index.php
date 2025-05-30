<?php 
    require_once 'profile.php';
    require_once '../script.php';

    $dbdata = connectDatabase();
    $users = getUsers($dbdata);
    $users = array_values($users);
    $posts = getPosts($dbdata);
    $posts = array_values($posts);
    $images = getImages($dbdata);
    $images = array_values($images);

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    } else {
        header('Location: ../home');        
    }

    foreach ($users as $user) {
        if ($user['id'] == $id) {
            $user_data = $user;
        }
    }

    if ($user_data == null) {
        header('Location: ../home');
    }
    
    $user_posts = array_values(array_filter($posts, fn($post) => $post['author_id'] == $id));
    $user_posts = array_values($user_posts);

    $user_images = array_filter($images, fn($image) => in_array($image['post_id'], array_column($user_posts, 'id')));
    $user_images = array_values($user_images);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Профиль</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="page">
        <div class="menu">
            <a href="../home">
                <img class="menu__icon" src="../image/go-home.svg" alt="иконка домой">
            </a>
            <a href="../profile/?id=<?php echo $users[0]['id'] ?>">
                <img class="menu__icon" src="../image/my_account_active.svg" alt="иконка профиля">
            </a>
            <img class="menu__icon" src="../image/new-post.svg" alt="иконка добавить">
        </div>
        <div class="content">
            <?php 
                renderProfile($user_posts, $user_data, $user_images);
            ?>
        </div>
    </div>
</body>
</html>