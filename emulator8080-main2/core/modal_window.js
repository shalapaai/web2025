document.addEventListener('DOMContentLoaded', function() {
    const showTableBtn = document.getElementById('buttonView');
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Показать модальное окно
    showTableBtn.addEventListener('click', function() {
      modalOverlay.classList.remove('opcode-table_hidden');;
    });
    
    // Закрыть при клике вне модального окна
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        modalOverlay.classList.add('opcode-table_hidden');
      }
    });
  });