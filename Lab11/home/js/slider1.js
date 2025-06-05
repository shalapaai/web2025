document.addEventListener('DOMContentLoaded', function() {
    const imageDivs = document.querySelectorAll('.post__images');

    imageDivs.forEach(div => {
        const images = div.querySelectorAll('.post__image');
        const sliderLeft = div.querySelector('.post__slider_left');
        const sliderRight = div.querySelector('.post__slider_right');
        const counter = div.querySelector('.post__counter span');
     
        images.forEach((img, index) => {
            img.classList.toggle('hidden', index !== 0);
        });
        
        const updateCounter = () => {
            if (!counter) return;
            const visibleIndex = [...images].findIndex(img => !img.classList.contains('hidden'));
            counter.textContent = `${visibleIndex + 1}/${images.length}`;
        };

        sliderRight?.addEventListener('click', function() {
            let currentIndex = [...images].findIndex(img => !img.classList.contains('hidden'));

            images[currentIndex].classList.add('hidden');
            const nextIndex = (currentIndex + 1) % images.length;
            images[nextIndex].classList.remove('hidden');
            
            updateCounter();
        });

        sliderLeft?.addEventListener('click', function() {
            let currentIndex = [...images].findIndex(img => !img.classList.contains('hidden'));

            images[currentIndex].classList.add('hidden');
            const nextIndex = (currentIndex - 1 + images.length) % images.length;
            images[nextIndex].classList.remove('hidden');
            
            updateCounter();
        });

        updateCounter();
    });
});