/**
 * Timeline Interativa - Script JavaScript
 * Responsável por detectar scroll e revelar os cards com animação
 */

// ===================================
// CONFIGURAÇÕES
// ===================================

const ANIMATION_CONFIG = {
    threshold: 0.3, // 30% do elemento visível para ativar animação
    rootMargin: '0px 0px -50px 0px' // Margem para ativar a animação antes de entrar
};

// ===================================
// INICIALIZAÇÃO - QUANDO O DOM ESTÁ PRONTO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Timeline inicializada');
    initScrollReveal();
    setupSmoothScroll();
    setupScrollToTimelineButton();
    setupTimelineCardsClickable();
});

function setupScrollToTimelineButton() {
    const button = document.getElementById('scrollToTimeline');
    const target = document.getElementById('timeline');

    if (!button || !target) return;

    button.addEventListener('click', (event) => {
        event.preventDefault();

        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
}

function setupTimelineCardsClickable() {
    const cards = document.querySelectorAll('.timeline-card');

    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        const detailId = card.dataset.detailId;
        const metaButton = card.querySelector('.card-meta');

        const focusCard = () => {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const cardTop = card.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: cardTop - navHeight - 10,
                behavior: 'smooth'
            });

            document.querySelectorAll('.timeline-card.active').forEach(activeCard => {
                activeCard.classList.remove('active');
            });

            card.classList.add('active');
        };

        card.addEventListener('click', () => focusCard());
        card.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                focusCard();
            }
        });

        if (metaButton) {
            metaButton.setAttribute('role', 'button');
            metaButton.setAttribute('tabindex', '0');
            metaButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (detailId) {
                    window.open(`details.html?id=${encodeURIComponent(detailId)}`, '_blank');
                }
            });
            metaButton.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    if (detailId) {
                        window.open(`details.html?id=${encodeURIComponent(detailId)}`, '_blank');
                    }
                }
            });
        }

        // Small ID for hash navigation and accessibility
        const parentItem = card.closest('.timeline-item');
        if (parentItem && !parentItem.id) {
            parentItem.id = `item-${index + 1}`;
        }
    });
}

// ===================================
// FUNÇÃO PRINCIPAL - SCROLL REVEAL
// ===================================

/**
 * Usa Intersection Observer API para detectar quando os cards
 * entram no viewport e ativa a animação de revelação
 */
function initScrollReveal() {
    // Seleciona todos os items da timeline
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Cria um observador com as configurações
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Se o elemento entrou no viewport
            if (entry.isIntersecting) {
                // Adiciona a classe 'revealed' que ativa a animação CSS
                entry.target.classList.add('revealed');
                
                // Para de observar este elemento (não precisa mais)
                observer.unobserve(entry.target);
            }
        });
    }, ANIMATION_CONFIG);

    // Começa a observar cada item da timeline
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// ===================================
// FUNÇÃO AUXILIAR - SMOOTH SCROLL
// ===================================

/**
 * Melhora a experiência dos links internos da navegação
 * adicionando um efeito de scroll suave
 */
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.navbar-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obtém o ID do alvo do link
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calcula o offset para não ficar embaixo da navbar
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                // Anima o scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// EFEITOS ADICIONAIS - NAVBAR EM SCROLL
// ===================================

/**
 * Adiciona uma sombra mais pronunciada à navbar quando o usuário faz scroll
 */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 212, 255, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.1)';
    }
});

// ===================================
// TRATAMENTO DE PERFORMANCE
// ===================================

/**
 * Usa debounce para otimizar o event listener de scroll
 * Evita chamar a função muitas vezes em sequência rápida
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

