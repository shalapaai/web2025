function checkTextOverflow(text, button) {
    const styles = window.getComputedStyle(text);
    
    const lineHeight = parseInt(styles.lineHeight) || parseInt(styles.fontSize) * 1.2;
    const twoLinesHeight = lineHeight * 2;
    
    if (text.scrollHeight > twoLinesHeight) {
        button.style.display = 'inline-block';
    } else {
        button.style.display = 'none';
        text.classList.remove('short'); // Убедимся, что класс удалён для короткого текста
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        const text = post.querySelector('.post__text');
        const button = post.querySelector('.post__text-add');
        
        if (text && button) {
            checkTextOverflow(text, button);
            
            button.addEventListener('click', function() {
                text.classList.toggle('short');
                button.textContent = text.classList.contains('short') ? 'ещё' : 'свернуть';
            });
        }
    });
});