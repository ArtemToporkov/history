document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
        // Закрыть все остальные карточки
        document.querySelectorAll('.timeline-item').forEach(el => {
            if (el !== item) el.classList.remove('expanded');
        });

        // Переключить класс текущего
        const isExpanded = item.classList.contains('expanded');
        item.classList.toggle('expanded');

        // Если карточка стала открытой — прокрутиться к ней
        if (!isExpanded) {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    });
});
