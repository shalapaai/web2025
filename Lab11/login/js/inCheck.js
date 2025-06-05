document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    const formErrors = document.createElement('div');
    formErrors.className = 'login-form__errors hidden';
    form.insertBefore(formErrors, form.firstChild);
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showError(message) {
        formErrors.innerHTML = '';
        const createErrorElement = document.createElement('div');
        errorElement.className = 'login-form__error';
        errorElement.textContent = message;
        formErrors.appendChild(createErrorElement);
        formErrors.classList.remove('hidden');
    }
    
    function clearErrors() {
        formErrors.innerHTML = '';
        formErrors.classList.add('hidden');
        emailInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');
    }
    
    function validateForm() {
        clearErrors();
        let isValid = true;
        const emailEmpty = emailInput.value.trim() === '';
        const passwordEmpty = passwordInput.value.trim() === '';
        
        if (emailEmpty || passwordEmpty) {
            if (emailEmpty) {
                emailInput.classList.add('input-error'); 
            }
            if (passwordEmpty) {
                passwordInput.classList.add('input-error'); 
            }            
            showError('🤓 Поля обязательные');
            isValid = false;
            
        } else if (!validateEmail(emailInput.value.trim())) {
            emailInput.classList.add('input-error'); 
            showError('🤥 Неверный формат электронной почты');
            isValid = false;
        }
        
        return isValid;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            window.location.href = "../home";
        }
    });
    
    emailInput.addEventListener('input', function() {
        if (emailInput.value.trim() !== '') {
            emailInput.classList.remove('input-error');
            clearErrors();
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (passwordInput.value.trim() !== '') {
            passwordInput.classList.remove('input-error');
            clearErrors();
        }
    });
});