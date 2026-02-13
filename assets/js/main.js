$(document).ready(function () {
    // Inicializar corazones flotantes
    createFloatingHearts();
    
    // Control de música
    const musicToggle = $('#musicToggle');
    const bgMusic = $('#bgMusic')[0];
    let musicPlaying = false;
    
    // Función para intentar reproducir música
    function playMusic() {
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicToggle.addClass('playing');
                musicPlaying = true;
                console.log('Música iniciada correctamente');
            }).catch(error => {
                console.log('No se pudo reproducir automáticamente:', error);
                musicToggle.removeClass('playing');
                musicPlaying = false;
                // Mostrar indicación visual de que hay que hacer clic en el botón
                musicToggle.css('animation', 'pulse-hint 1s ease-in-out 3');
            });
        }
    }
    
    // Toggle de música manual
    musicToggle.on('click touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (musicPlaying) {
            bgMusic.pause();
            musicToggle.removeClass('playing');
            musicPlaying = false;
        } else {
            playMusic();
        }
    });
    
    // Animación de apertura de la carta
    $('.valentines-day').on('click touchstart', function (e) {
        e.preventDefault();
        
        // Solo permitir un clic
        if ($(this).hasClass('clicked')) {
            return;
        }
        $(this).addClass('clicked');
        
        // Intentar reproducir música al abrir (interacción del usuario)
        if (!musicPlaying) {
            playMusic();
        }
        
        // Animación de desvanecimiento de los elementos del sobre
        $('.envelope').css({ 
            'animation': 'fall 3s linear 1', 
            '-webkit-animation': 'fall 3s linear 1' 
        });
        
        // Lanzar confetti
        launchConfetti();
        
        $('.envelope').fadeOut(800, function () {
            // Ocultar elementos dentro de .valentines-day
            $('.valentines-day .heart, .valentines-day .text, .valentines-day .front, .tap-hint').hide();

            // Hacer visible la carta con una animación ondulante
            $('#card').css({ 
                'visibility': 'visible', 
                'opacity': 0, 
                'transform': 'translate(-50%, -50%) scale(0.1)' 
            });
            
            $('#card').animate({ 'opacity': 1 }, {
                duration: 1000, 
                step: function (now, fx) {
                    var scale = 1 + Math.sin(now * Math.PI) * 0.1;
                    var transform = 'translate(-50%, -50%) scale(' + scale + ')';
                    $(this).css('transform', transform);
                }
            });
            
            // Más confetti después de abrir
            setTimeout(() => launchConfetti(), 1000);
        });
    });
    
    // Función para crear corazones flotantes
    function createFloatingHearts() {
        const container = $('#floatingHearts');
        const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
        
        setInterval(() => {
            if ($('#card').css('visibility') === 'hidden') {
                const heart = $('<div class="floating-heart"></div>');
                heart.text(hearts[Math.floor(Math.random() * hearts.length)]);
                heart.css({
                    left: Math.random() * 100 + '%',
                    'animation-duration': (Math.random() * 3 + 4) + 's',
                    'animation-delay': Math.random() * 2 + 's'
                });
                container.append(heart);
                
                setTimeout(() => heart.remove(), 8000);
            }
        }, 800);
    }
    
    // Función para detectar dispositivos móviles
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Función para lanzar confetti
    function launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confettiCount = isMobile() ? 80 : 150;
        const confetti = [];
        const colors = ['#ff6b9d', '#ff85a6', '#ffa5ba', '#c06c84', '#ff385c', '#ffd6e0'];
        
        // Crear partículas de confetti
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 4,
                d: Math.random() * confettiCount,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: Math.random() * 0.07 + 0.05,
                tiltAngle: 0
            });
        }
        
        // Animar confetti
        let animationFrame;
        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            confetti.forEach((c, index) => {
                ctx.beginPath();
                ctx.lineWidth = c.r / 2;
                ctx.strokeStyle = c.color;
                ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
                ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
                ctx.stroke();
                
                c.tiltAngle += c.tiltAngleIncremental;
                c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
                c.tilt = Math.sin(c.tiltAngle) * 15;
                
                if (c.y > canvas.height) {
                    confetti.splice(index, 1);
                }
            });
            
            if (confetti.length > 0) {
                animationFrame = requestAnimationFrame(drawConfetti);
            } else {
                cancelAnimationFrame(animationFrame);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        drawConfetti();
    }
    
    // Ajustar canvas en redimensión
    window.addEventListener('resize', function() {
        const canvas = document.getElementById('confetti-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Prevenir zoom en doble tap en iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}); 
