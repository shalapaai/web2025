<?php
    require_once '../script.php';
    function handleAddPost() {
        $postData = [
            'id' => $_POST['id'],
            'author_id' => $_POST['author_id'],
            'content' => $_POST['content'], 
            'like' => $_POST['like']
        ]
    };

    function savePostToDatabase(PDO $connection, array $postParams): int {  
        $title = $connection->quote($postParams['title']);  
        $subtitle = $connection->quote($postParams['subtitle']);  
        $content = $connection->quote($postParams['content']);  
        $query = <<<SQL  
            INSERT INTO post (title, subtitle, content)  
            VALUES ($title, $subtitle, $content)  
            SQL;
    }
    $connection = connectDatabase();

    function findPostInDatabase() {

    }

    $postId = savePostToDatabase($connection, [
        'title' => 'Новый пост',
        'subtitle' => 'Новый подзаголовок',
        'content' => 'Текст-рыба для нового поста',
    ]);
    $post = findPostInDatabase($connection, $postId);

    $connection = connectDatabase();
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        exit;
    }
    handleAddPost();
?>