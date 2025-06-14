<?php
    $users_json = file_get_contents("../data/users.json", true);
    $users = json_decode($users_json, true);
    $posts_json = file_get_contents("../data/posts.json", true);
    $posts = json_decode($posts_json, true);
    
    $filterByUserId = $_GET['id'] ?? null;

    $isValidUser = $filterByUserId ? in_array($filterByUserId, array_column($users, 'id')) : false;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Главная</title>
    <link href="styles.css" rel="stylesheet">
</head>
<body>
    <div class="page">
        <div class="menu">
            <a href="../home">
                <img class="menu__icon" src="../image/go-home_active.svg" alt="иконка домой">
            </a>
            <a href="../profile/?id=<?php echo $users[0]['id'] ?>">
                <img class="menu__icon" src="../image/my_account.svg" alt="иконка профиля">
            </a>
            <img class="menu__icon" src="../image/new-post.svg" alt="иконка добавить">
        </div>
        <div class="container">  
        <?php
            require_once 'post.php';
            foreach ($posts as $post) {
                $user_data = $users[array_search($post["author_id"], array_column($users, "id"))];     
                if (!$filterByUserId || !$isValidUser || $user_data['id'] == $filterByUserId) {
                    renderPost($post, $user_data);
                }
            }
        ?>    
        </div>
    </div>
</body>
</html>