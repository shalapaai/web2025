<?php
    require_once '../script.php';
    
    $dbdata = connectDatabase();
    $users = getUsers($dbdata);
    $users = array_values($users);
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
            <a href="../create">
                <img class="menu__icon" src="../image/new-post.svg" alt="иконка добавить">
            </a>
        </div>
    </div>
</body>
</html>