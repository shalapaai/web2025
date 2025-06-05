document.addEventListener('DOMContentLoaded', function() {
    function checkTextOverflow(text, button) {
        const styles = window.getComputedStyle(text);     
        const twoLinesHeight = parseFloat(styles.fontSize) * 2;    
        
        if (text.scrollHeight > twoLinesHeight) {
            button.classList.remove('hidden');
            text.classList.add('short');
        } else {
            button.classList.add('hidden');
            text.classList.remove('short');
        }
    }
    
    
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        const text = post.querySelector('.post__text');
        const button = post.querySelector('.post__text-add');
        
        if (text && button) {
            checkTextOverflow(text, button);
            
            button.addEventListener('click', function() {
                text.classList.toggle('short');
                button.textContent = text.classList.contains('short') ? 'еще' : 'свернуть';
            });
        }
    });
});