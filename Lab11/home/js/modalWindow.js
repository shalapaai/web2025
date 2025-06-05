document.addEventListener('DOMContentLoaded', function() {

    const modal = document.getElementById('imageModal');
    const modalImagesContainer = document.querySelector('.modal-images');
    const modalCounter = document.querySelector('.modal-counter');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalSliderLeft = document.querySelector('.modal-slider-left');
    const modalSliderRight = document.querySelector('.modal-slider-right');
    
    let currentModalIndex = 0;
    let currentPostImages = [];

    function openModal(postElement, index) {
        currentPostImages = Array.from(postElement.querySelectorAll('.post__image')).map(img => img.src);
        currentModalIndex = index;

        if (currentPostImages.length <= 1) {
            modalSliderLeft.classList.add('hidden');
            modalSliderRight.classList.add('hidden');;
            modalCounter.classList.add('hidden');
        }
        
        updateModalSlider();
        modal.classList.add('active-flex');
        document.body.classList.add('scroll-block');
    }
    
    function updateModalSlider() {
        modalImagesContainer.innerHTML = '';
        
        currentPostImages.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `изображение ${index + 1}`;
            if (index === currentModalIndex) {
                img.classList.toggle('active');
            }
            modalImagesContainer.appendChild(img);
        })
        modalCounter.textContent = `${currentModalIndex + 1} из ${currentPostImages.length}`;
    }

    function closeModal() {
        modal.classList.remove('active-flex');
        document.body.classList.remove('scroll-block');
        
        modalSliderLeft.classList.remove('hidden');
        modalSliderRight.classList.remove('hidden');;
        modalCounter.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active-flex')) {
            closeModal();
        }
    });
    
    modalSliderLeft.addEventListener('click', () => {
        currentModalIndex = (currentModalIndex - 1 + currentPostImages.length) % currentPostImages.length;
        updateModalSlider();
    });
    
    modalSliderRight.addEventListener('click', () => {
        currentModalIndex = (currentModalIndex + 1) % currentPostImages.length;
        updateModalSlider();
    }); 
  
    document.querySelectorAll('.post__image').forEach((img) => {
        img.addEventListener('click', (e) => {
            const postElement = e.target.closest('.post');
            const postImages = Array.from(postElement.querySelectorAll('.post__image'));
            const clickedIndex = postImages.indexOf(e.target);
            openModal(postElement, clickedIndex);
        });
    });
});