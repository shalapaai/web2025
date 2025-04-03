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

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Профиль <?= htmlspecialchars($current_user['name']) ?></title>
    <link rel="stylesheet" href="styles3.css">
</head>
<body>
    <div class="profile-container">
        <div class="profile-header">
            <h1><?= htmlspecialchars($current_user['name']) ?></h1>
            <a href="home.php" class="back-link">На главную</a>
        </div>
        
        <div class="profile-info">
            <img src="<?= htmlspecialchars($current_user['avatar']) ?>" 
                 alt="Аватар" 
                 class="profile-avatar">
            
            <div class="profile-details">
                <p>Дата регистрации: 
                    <?= date('d.m.Y', $current_user['registered_at']) ?>
                </p>
                
                <p>Email: <?= htmlspecialchars($current_user['email']) ?></p>
                <p>Город: <?= htmlspecialchars($current_user['city']) ?></p>
            </div>
        </div>

        <div class="user-posts">
            <h2>Посты пользователя</h2>
            <?php if (!empty($user_posts)): ?>
                <?php foreach ($user_posts as $post): ?>
                    <div class="post">
                        <p><?= htmlspecialchars($post['content']) ?></p>
                        <div class="post-info">
                            <span><?= date('d.m.Y H:i', $post['created_at']) ?></span>
                            <span>❤ <?= $post['likes'] ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>Пользователь пока не написал ни одного поста</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>