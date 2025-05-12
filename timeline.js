(function () {
    // Блокируем pinch-to-zoom / другие жесты
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    }, { passive: false });

    const speedFactor = 1;
    const btnStep = 600;
    const easeFactor = 0.1;

    let targetX = window.scrollX;
    let isAnimating = false;
    // Флаг прерывания автоскролла
    let isUserInteracted = false;
    let touchHandler = null;

    const btnLeft = document.querySelector('.left-button');
    const btnRight = document.querySelector('.right-button');
    const items = document.querySelectorAll('.timeline-item');

    function ensureAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(animateScroll);
        }
    }

    function clampTarget() {
        const maxX = document.body.scrollWidth - window.innerWidth;
        targetX = Math.max(0, Math.min(targetX, maxX));
    }

    function animateScroll() {
        // Если пользователь коснулся после старта — отменяем автоскролл
        if (isUserInteracted) {
            isAnimating = false;
            return;
        }

        const currentX = window.scrollX;
        const delta = targetX - currentX;

        if (Math.abs(delta) < 0.5) {
            window.scrollTo({ left: targetX });
            isAnimating = false;
            return;
        }

        window.scrollTo({
            left: currentX + delta * easeFactor,
            behavior: 'auto'
        });

        requestAnimationFrame(animateScroll);
    }

    function isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    function isMouseOverScrollableInfo(event) {
        const el = document.elementFromPoint(event.clientX, event.clientY);
        if (!el) return false;

        const expanded = el.closest('.timeline-item.expanded');
        return expanded && expanded.scrollHeight > expanded.clientHeight;
    }

    function onWheel(event) {
        if (isMobile()) return;
        if (isMouseOverScrollableInfo(event)) return;

        event.preventDefault();
        targetX += event.deltaY * speedFactor;
        clampTarget();
        ensureAnimation();
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (isMobile()) {
            const initialOffset = 150;
            window.scrollTo({ left: initialOffset, behavior: 'auto' });
        }
    });

    btnLeft.addEventListener('click', () => {
        targetX = window.scrollX - btnStep;
        clampTarget();
        ensureAnimation();
    });

    btnRight.addEventListener('click', () => {
        targetX = window.scrollX + btnStep;
        clampTarget();
        ensureAnimation();
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            // Убираем expanded у других
            items.forEach(el => {
                if (el !== item) el.classList.remove('expanded');
            });

            const isExpanded = item.classList.toggle('expanded');

            if (isExpanded) {
                // Сбрасываем флаг и вешаем слушатель касания
                isUserInteracted = false;
                touchHandler = () => {
                    isUserInteracted = true;
                    document.removeEventListener('touchstart', touchHandler);
                };
                document.addEventListener('touchstart', touchHandler, { passive: true });

                // Считаем новую цель скролла и запускаем анимацию
                const rect = item.getBoundingClientRect();
                const middleOffset = (rect.left + rect.right) / 2 - window.innerWidth / 2;
                targetX = window.scrollX + middleOffset;
                clampTarget();
                ensureAnimation();
            } else {
                // Если карточка закрыта — снимаем слушатель, если он ещё висит
                if (touchHandler) {
                    document.removeEventListener('touchstart', touchHandler);
                    touchHandler = null;
                }
            }
        });
    });

    document.addEventListener('wheel', onWheel, { passive: false });
})();
