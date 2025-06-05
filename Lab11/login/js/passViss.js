document.addEventListener('DOMContentLoaded', function() {
    const passwordContainers = document.querySelector('.login-form__password');
    
    const passwordInput = passwordContainers.querySelector('input');
    const passwordViss = passwordContainers.querySelector('img');
    
    passwordViss.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordViss.src = '../image/eye-open.svg'; 
            passwordViss.alt = 'скрыть пароль';
        } else {
            passwordInput.type = 'password';
            passwordViss.src = '../image/eye-closed.svg'; 
            passwordViss.alt = 'показать пароль';
        }
    });
});