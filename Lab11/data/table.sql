CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `user_avatar` VARCHAR(255),
    `status` VARCHAR(400) NOT NULL,
    `email` VARCHAR(254) NOT NULL UNIQUE,
    `password` VARCHAR(64) NOT NULL
);

CREATE TABLE `post` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `author_id` VARCHAR(36) NOT NULL,
    `likes` INT UNSIGNED DEFAULT 0,
    `content` MEDIUMTEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `image` (
    `post_id` VARCHAR(36) NOT NULL,
    `image_path` VARCHAR(255),
    PRIMARY KEY (`post_id`, `image_path`)
);

/*
запуск mysql
    mysql -u root

использование бд
    USE blog;

показать все таблицы
    SHOW TABLES;

показать конкретную таблицу 
    SELECT * FROM post;
    SELECT * FROM user;
    SELECT * FROM image;

вставка в таблицу
    *файлы posts.sql, users.sql*

удаление таблицы
    DROP TABLE post;
    DROP TABLE user;
    DROP TABLE image;

создание таблиц
    файл table.sql
*/