document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
        const isOpen = item.classList.contains('expanded');
        document.querySelectorAll('.timeline-item.expanded').forEach(el => {
            if (el !== item) el.classList.remove('expanded');
        });
        if (isOpen) {
            item.classList.remove('expanded');
        } else {
            item.classList.add('expanded');
        }
    });
});
