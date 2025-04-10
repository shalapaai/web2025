<?php
session_start();
$error = $_SESSION['error'] ?? '';
unset($_SESSION['error']);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Логин</title>
    <link rel="stylesheet" href="styles1.css">
</head>
<body>
    <div class="login-container">
        <?php if (!empty($error)): ?>
            <div class="error-message">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>
        
        <div class="login-container__image">
            <img src="image/login.png" alt="Фото регистрации" class="login-container__img">
        </div>
        <div class="login-container__form">
            <h1 class="login-container__title">Войти</h1>
            <form action="auth/login.php" method="post" class="login-container__form">
                <div class="login-container__input-group">
                    <label class="login-container__input-label">Электронная почта:
                        <input type="email" name="email" required class="login-container__input-field">
                    </label>
                </div>
                <div class="login-container__input-group">
                    <label class="login-container__input-label">Пароль:
                        <input type="password" name="password" required class="login-container__input-field">
                    </label>
                </div>
                <div class="login-container__button-container">
                    <button type="submit" class="login-container__button">Продолжить</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>