<?php
    function connectDatabase(): PDO
    {
        $dsn = 'mysql:host=127.0.0.1;dbname=blog';
        $user = 'root';
        $password = '';
        return new PDO($dsn, $user, $password);
    }
    function getPosts(PDO $dbdata): ?array
    {
        return $dbdata->query("SELECT * FROM post")->fetchAll(PDO::FETCH_ASSOC);
    }
    function getUsers(PDO $dbdata): ?array
    {
        return $dbdata->query("SELECT * FROM user")->fetchAll(PDO::FETCH_ASSOC);
    }
    function getImages(PDO $dbdata): ?array
    {
        return $dbdata->query("SELECT * FROM image")->fetchAll(PDO::FETCH_ASSOC);
    }

    // function getTime($timestamp) {
    //     $current_time = time();
    //     $diff = $current_time - $timestamp;
        
    //     $intervals = array(
    //         31536000 => 'год',
    //         2592000 => 'месяц',
    //         604800 => 'неделю',
    //         86400 => 'день',
    //         3600 => 'час',
    //         60 => 'минуту',
    //         1 => 'секунду'
    //     );
        
    //     $plural_forms = array(
    //         'год' => 'года',
    //         'месяц' => 'месяца',
    //         'неделю' => 'недели',
    //         'день' => 'дня',
    //         'час' => 'часа',
    //         'минуту' => 'минуты',
    //         'секунду' => 'секунды'
    //     );
        
    //     foreach ($intervals as $interval => $text) {
    //         if ($diff >= $interval) {
    //             $value = floor($diff / $interval);
                
    //             if ($value >= 5 && $value <= 20) {
    //                 $text = $plural_forms[$text].' назад';
    //             } else {
    //                 $last_digit = $value % 10;
    //                 if ($last_digit == 1) {
    //                     $text = $text.' назад';
    //                 } elseif ($last_digit >= 2 && $last_digit <= 4) {
    //                     $text = $plural_forms[$text].' назад';
    //                 } else {
    //                     $text = $plural_forms[$text].' назад';
    //                 }
    //             }
                
    //             return $value.' '.$text;
    //         }
    //     }
    // }
?>