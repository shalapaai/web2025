document.addEventListener('DOMContentLoaded', function() {
    const imageDivs = document.querySelectorAll('.post__images');

    imageDivs.forEach(div => {
        const images = div.querySelectorAll('.post__image');
        const sliderLeft = div.querySelector('.post__slider_left');
        const sliderRight = div.querySelector('.post__slider_right');
        const counter = div.querySelector('.post__counter span');

        // Инициализация - скрываем все кроме первого изображения
        images.forEach((img, index) => {
            img.classList.toggle('hidden', index !== 0);
        });
        // Функция для обновления счетчика
        const updateCounter = () => {
            if (!counter) return;
            const visibleIndex = [...images].findIndex(img => !img.classList.contains('hidden'));
            counter.textContent = `${visibleIndex + 1}/${images.length}`;
        };

        // Обработчик для кнопки вправо
        sliderRight?.addEventListener('click', function() {
            const currentVisible = div.querySelector('.post__image:not(.hidden)');
            if (!currentVisible) return;

            currentVisible.classList.add('hidden');
            
            // Если есть следующее изображение - показываем его, иначе возвращаемся к первому
            const nextImg = currentVisible.nextElementSibling || images[0];
            nextImg.classList.remove('hidden');
            
            updateCounter();
        });

        sliderLeft?.addEventListener('click', function() {
            const currentVisible = div.querySelector('.post__image:not(.hidden)');
            if (!currentVisible) return;

            currentVisible.classList.add('hidden');
            
            // Если есть предыдущее изображение - показываем его, иначе переходим к последнему
            const prevImg = currentVisible.previousElementSibling || images[images.length - 1];
            prevImg.classList.remove('hidden');
            
            updateCounter();
        });

        // Инициализация счетчика
        updateCounter();
    });
});