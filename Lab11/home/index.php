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
    <link href="style.css" rel="stylesheet">
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
            <a href="../create">
                <img class="menu__icon" src="../image/new-post.svg" alt="иконка добавить">
            </a>
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
                    renderPost($post, $users, $user_data, $images_data);
                }
            }
        ?>    
        </div>
    </div>

    <!-- Модальное окно -->
    <div class="modal" id="imageModal">
        <div class="modal-content">
            <img class="close-modal" src="../image/close.svg" alt="закрыть">
            <div class="modal-slider">        
                <div class="modal-images"></div>
                <img class="modal-slider-left" src="../image/slider_button_left.svg" alt="слайдер">
                <img class="modal-slider-right" src="../image/slider_button_right.svg" alt="слайдер">
            </div>
            <div class="modal-counter"></div>
        </div>
    </div>

    <script src="js/addButton1.js"></script>
    <script src="js/slider.js"></script>
    <script src="js/modalWindow.js"></script>
</body>
</html>