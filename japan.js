    window.addEventListener('DOMContentLoaded', () => {
        // ── PETALS ──
        const canvas = document.getElementById('petal-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
        resize(); window.addEventListener('resize', resize);

        const PETALS = 60;
        const petals = [];
        function rand(a, b) { return a + Math.random() * (b - a) }

        for (let i = 0; i < PETALS; i++) {
            petals.push({
                x: rand(0, window.innerWidth),
                y: rand(-window.innerHeight, window.innerHeight * .3),
                size: rand(5, 14),
                speedY: rand(.65, 2.0),
                speedX: rand(-.45, .3),
                rot: rand(0, Math.PI * 2),
                rotSpeed: rand(-.028, .028),
                opacity: rand(.28, .72),
                wobble: rand(0, Math.PI * 2),
                wobbleSpeed: rand(.012, .036),
            });
        }

        function drawPetal(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size / 2.4, p.size, 0, 0, Math.PI * 2);
            const hue = 338 + Math.random() * 18;
            const sat = 50 + Math.random() * 22;
            const lit = 68 + Math.random() * 12;
            ctx.fillStyle = `hsl(${hue},${sat}%,${lit}%)`;
            ctx.fill();
            ctx.restore();
        }

        function animatePetals() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(p => {
                p.y += p.speedY;
                p.wobble += p.wobbleSpeed;
                p.x += p.speedX + Math.sin(p.wobble) * .55;
                p.rot += p.rotSpeed;
                if (p.y > canvas.height + 20) {
                    p.y = -20;
                    p.x = rand(0, canvas.width);
                }
                drawPetal(p);
            });
            requestAnimationFrame(animatePetals);
        }
        animatePetals();


        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('visible');
            });
        }, { threshold: .1 });
        document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));


        document.querySelectorAll('.card,.contact-box,.journey-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - .5;
                const y = (e.clientY - r.top) / r.height - .5;
                card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform .5s ease, box-shadow .35s, border-color .3s';
                card.style.transform = '';
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform .1s ease, box-shadow .35s, border-color .3s';
            });
        });

        const aboutTypingCards = [
            { cardSelector: '.c1', descId: 'about-desc-1', speed: 22 },
            { cardSelector: '.c2', descId: 'about-desc-5', speed: 26 },
            { cardSelector: '.c3', descId: 'about-desc-2', speed: 28 },
            { cardSelector: '.c4', descId: 'about-desc-3', speed: 20 },
            { cardSelector: '.c5', descId: 'about-desc-4', speed: 18 },
        ];

        aboutTypingCards.forEach(({ cardSelector, descId, speed }) => {
            const card = document.querySelector(cardSelector);
            const desc = document.getElementById(descId);
            if (!card || !desc) return;

            const fullText = desc.textContent.trim();
            let typingTimer = null;

            function typeText() {
                desc.textContent = '';
                let i = 0;
                function step() {
                    if (i < fullText.length) {
                        desc.textContent += fullText[i];
                        i++;
                        typingTimer = setTimeout(step, speed + Math.random() * 12);
                    }
                }
                step();
            }

            function clearTyping() {
                clearTimeout(typingTimer);
                desc.textContent = '';
            }

            card.addEventListener('mouseenter', () => {
                clearTyping();
                typingTimer = setTimeout(typeText, 180);
            });

            card.addEventListener('mouseleave', () => {
                clearTyping();
            });
        });
    });