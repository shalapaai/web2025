<?php 
    $users_json = file_get_contents("../data/users.json", true);
    $users = json_decode($users_json, true);
    $posts_json = file_get_contents("../data/posts.json", true);
    $posts = json_decode($posts_json, true);

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    } else {
        header('Location: ../home');
        exit();
    }

    foreach ($users as $user) {
        if ($user['id'] == $id) {
            $user_data = $user;
        }
    }

    if ($user_data == null) {
        header('Location: ../home');
        exit();
    }

    $user_posts = array_values(array_filter($posts, fn($post) => $post['author_id'] == $id));
    $user_posts = array_values($user_posts);
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
                require_once 'profile.php';
                renderProfile($user_posts, $user_data);
            ?>
        </div>
    </div>
</body>
</html>