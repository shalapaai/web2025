<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>Регистрация</title>
        <link href="style.css" rel="stylesheet">
    </head>
    <body>  
        <div class="content">  
            <div class="login-sidebar">
                <h1 class="login-sidebar__title">Войти</h1>           
                <img class="login-sidebar__photo" src="../image/main-first-photo.png" alt="Главное фото">        
            </div>
            <form class="login-form" action="">
                <p class="login-form__name-of-input">Электропочта</p>
                <input class="login-form__user-information" type="text">
                <p class="login-form__input-info">Введите электропочту в формате *****@***.**</p>
                <p class="login-form__name-of-input">Пароль</p>
                <div class="login-form__password">
                    <input class="login-form__user-information" id="password" type="password">
                    <img class="login-form__eye" src="../image/eye-closed.svg" alt="Скрыть">
                </div>
                <button class="login-form__submit-button" type="submit">Продолжить</button>
            </form>
        </div>
        <script src="js/passViss.js"></script>
        <script src="js/inCheck.js"></script>
    </body>
</html>