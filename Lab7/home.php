<?php
require_once 'helpers.php';

$users = json_decode(file_get_contents('users.json'), true);
$posts = json_decode(file_get_contents('posts.json'), true);

$valid_posts = array_filter($posts, function($post) {
    return isset(
        $post['id'],
        $post['user_id'],
        $post['content'],
        $post['created_at']
    );
});

$selected_user = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
if ($selected_user) {
    $valid_posts = array_filter($valid_posts, fn($p) => $p['user_id'] == $selected_user);
}

$posts_data = [];
foreach ($valid_posts as $post) {
    $user = array_values(array_filter($users, fn($u) => $u['id'] == $post['user_id']))[0];
    
    if ($user) {
        $posts_data[] = [
            'post_id' => $post['id'],
            'content' => $post['content'],
            'likes' => $post['likes'] ?? 0,
            'timestamp' => $post['created_at'],
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'] ?? 'Неизвестный',
                'avatar' => file_exists($user['avatar']) ? $user['avatar'] : 'image/default-avatar.jpg'
            ]
        ];
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лента новостей</title>
    <link rel="stylesheet" href="styles2.css">
</head>
<body>
    <div class="feed-container">
        <div class="header">
            <h1 class="feed-title">Лента новостей</h1>
            <div class="user-filter">
                <form method="GET">
                    <select name="user_id" onchange="this.form.submit()">
                        <option value="">Все пользователи</option>
                        <?php foreach ($users as $user): ?>
                        <option>
                            value="<?= $user['id'] ?>" 
                            <?= $selected_user == $user['id'] ? 'selected' : '' ?>
                            <?= htmlspecialchars($user['name']) ?>
                        </option>
                        <?php endforeach; ?>
                    </select>
                </form>
            </div>
        </div>
        <div class="new-post">
        </div>
        <div class="recent-posts">
            <h2 class="recent-title">
                <?= $selected_user ? 'Посты пользователя' : 'Все посты' ?>
            </h2>
            <?php if (count($posts_data) > 0): ?>
                <?php foreach ($posts_data as $data): ?>
                <div class="post">
                    <div class="post-header">
                        <a href="profile.php?id=<?= $data['user']['id'] ?>">
                            <img 
                                src="<?= htmlspecialchars($data['user']['avatar']) ?>" 
                                alt="Аватар" 
                                class="author-avatar"
                            >
                        </a>
                        <div class="author-info">
                            <h3 class="author-name">
                                <?= htmlspecialchars($data['user']['name']) ?>
                            </h3>
                            <span class="post-time">
                                <?= time_ago($data['timestamp']) ?>
                            </span>
                        </div>
                    </div>
                    <p class="post-content">
                        <?= htmlspecialchars($data['content']) ?>
                    </p>
                    <div class="post-stats">
                        <span class="like-count">
                            ❤ <?= $data['likes'] ?>
                        </span>
                        <a 
                            href="post.php?id=<?= $data['post_id'] ?>" 
                            class="comments-link"
                        >
                            💬 Комментарии
                        </a>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="no-posts">
                    <p>Пока нет ни одного поста</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>