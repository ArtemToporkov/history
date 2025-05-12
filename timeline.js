(function () {
    const speedFactor = 1;
    const btnStep = 600;
    const easeFactor = 0.1;

    let targetX = window.scrollX;
    let isAnimating = false;

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

    function isMouseOverScrollableInfo(event) {
        const el = document.elementFromPoint(event.clientX, event.clientY);
        if (!el) return false;

        const expanded = el.closest('.timeline-item.expanded');
        if (!expanded) return false;

        return expanded.scrollHeight > expanded.clientHeight;
    }

    function onWheel(event) {
        if (isMouseOverScrollableInfo(event)) {
            return;
        }

        // Иначе — скроллим страницу
        event.preventDefault();
        targetX += event.deltaY * speedFactor;
        clampTarget();
        ensureAnimation();
    }

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
            items.forEach(el => {
                if (el !== item) el.classList.remove('expanded');
            });

            const isExpanded = item.classList.toggle('expanded');

            if (isExpanded) {
                const rect = item.getBoundingClientRect();
                const middleOffset = (rect.left + rect.right) / 2 - window.innerWidth / 2;
                targetX = window.scrollX + middleOffset;
                clampTarget();
                ensureAnimation();
            }
        });
    });

    document.addEventListener('wheel', onWheel, { passive: false });
})();
