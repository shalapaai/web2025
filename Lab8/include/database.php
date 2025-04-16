<?php
    const DB_HOST = '127.0.0.1';
    const DB_NAME = 'blog';
    const DB_USER = 'root'; //свой пользователь должен быть
    const DB_PASSWORD = ''; //тоже

    function connectToDatabase(): PD0 {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME;
        return new PD0($dsn, username: DB_USER, password: DB_PASSWORD;)
    }

    function gerPostsFromDatabase(PD0 $connection, imt $limit = 100): array {
        $query = <<<SQL
            SELECT
                title, image
            FROM
                post
            LIMIT {$limit}
        SQL;

        $statement = $connection->query($query);
        return $statement->fetchAll(mode: PD0::FETCH_ASSOC);
    }    

    function savePostToDatabase(PD0 $connection, string $title, string $image): bool {
        $query = <<<SQL
            INSERT INTO
                post(title, image)
            VALUES
                (:title, :image)
        SQL;

        $statement = $connection->prepare($query);
        return $statement->execute([
            ':title' => $title,
            ':image' => $image,
        ]);
    }
?>