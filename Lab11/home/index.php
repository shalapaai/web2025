<?php
    require_once 'post.php';
    require_once '../script.php';
    
    $dbdata = connectDatabase();
    $users = getUsers($dbdata);
    $users = array_values($users);
    $posts = getPosts($dbdata);
    $posts = array_values($posts);
    $images = getImages($dbdata);
    $images = array_values($images);

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
            foreach ($posts as $post) {
                $user_data = $users[array_search($post["author_id"], array_column($users, "id"))];
                $images_data = (array_filter($images, function($img) use ($post) {
                    return $img['post_id'] == $post['id'];
                }));
                $images_data = array_values($images_data);
                if (!$filterByUserId || !$isValidUser || $user_data['id'] == $filterByUserId) {
                    renderPost($post, $user_data, $images_data);
                }
            }
        ?>    
        </div>
    </div>
    <script src="js/addButton.js"></script>
    <script src="js/slider.js"></script>
</body>
</html>