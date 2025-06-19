
// FAQ Accordion and Category Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Category navigation
    initializeCategoryNavigation();
    
    // Search functionality
    initializeSearchIfExists();
    
    console.log('FAQ JavaScript initialized');
});

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items in the same category
            const category = item.closest('.faq-category');
            const categoryItems = category.querySelectorAll('.faq-item');
            categoryItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    otherAnswer.style.maxHeight = null;
                    otherToggle.textContent = '+';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                toggle.textContent = '+';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.textContent = '−';
                
                // Track FAQ interaction
                trackEvent('faq_question_opened', {
                    question: question.querySelector('h3').textContent,
                    category: category.dataset.category
                });
            }
        });
    });
}

function initializeCategoryNavigation() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categories = document.querySelectorAll('.faq-category');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target category, hide others
            categories.forEach(category => {
                if (category.dataset.category === targetCategory) {
                    category.style.display = 'block';
                    // Close all FAQ items in this category
                    const items = category.querySelectorAll('.faq-item');
                    items.forEach(item => {
                        item.classList.remove('active');
                        const answer = item.querySelector('.faq-answer');
                        const toggle = item.querySelector('.faq-toggle');
                        answer.style.maxHeight = null;
                        toggle.textContent = '+';
                    });
                } else {
                    category.style.display = 'none';
                }
            });
            
            // Track category selection
            trackEvent('faq_category_selected', {
                category: targetCategory
            });
            
            console.log('FAQ category changed to:', targetCategory);
        });
    });
}

function initializeSearchIfExists() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase().trim();
            searchFAQ(searchTerm);
        }, 300);
    });
}

function searchFAQ(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    const categories = document.querySelectorAll('.faq-category');
    const categoryButtons = document.querySelectorAll('.category-btn');
    let hasResults = false;
    
    if (!searchTerm) {
        // Reset to show all items
        faqItems.forEach(item => {
            item.style.display = 'block';
        });
        
        // Show first category
        categories.forEach((category, index) => {
            category.style.display = index === 0 ? 'block' : 'none';
        });
        
        categoryButtons.forEach((btn, index) => {
            btn.classList.toggle('active', index === 0);
        });
        
        return;
    }
    
    // Hide all categories and show all items for search
    categories.forEach(category => {
        category.style.display = 'block';
    });
    
    // Hide category navigation during search
    const categoryNav = document.querySelector('.category-nav');
    if (categoryNav) {
        categoryNav.style.display = 'none';
    }
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            hasResults = true;
            
            // Highlight search term
            highlightSearchTerm(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show no results message
    showNoResultsMessage(!hasResults, searchTerm);
    
    // Track search
    trackEvent('faq_search', {
        search_term: searchTerm,
        results_found: hasResults
    });
}

function highlightSearchTerm(item, searchTerm) {
    const question = item.querySelector('.faq-question h3');
    const answer = item.querySelector('.faq-answer');
    
    // Remove previous highlights
    [question, answer].forEach(element => {
        element.innerHTML = element.textContent;
    });
    
    if (searchTerm.length < 2) return;
    
    // Add highlights
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    
    question.innerHTML = question.textContent.replace(regex, '<mark>$1</mark>');
    
    // For answer, be more careful with HTML structure
    const answerText = answer.textContent;
    const highlightedText = answerText.replace(regex, '<mark>$1</mark>');
    if (highlightedText !== answerText) {
        answer.innerHTML = highlightedText;
    }
}

function showNoResultsMessage(show, searchTerm) {
    let noResultsDiv = document.querySelector('.no-results-message');
    
    if (show) {
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results-message';
            noResultsDiv.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <h3>No se encontraron resultados</h3>
                    <p>No encontramos preguntas relacionadas con "${searchTerm}"</p>
                    <p>Intenta con otras palabras clave o <a href="contact.html">contáctanos directamente</a></p>
                </div>
            `;
            document.querySelector('.faq-container').appendChild(noResultsDiv);
        }
        noResultsDiv.style.display = 'block';
    } else {
        if (noResultsDiv) {
            noResultsDiv.style.display = 'none';
        }
    }
}

// Add search functionality to page
function addSearchToFAQ() {
    const faqHeader = document.querySelector('.faq-header');
    if (!faqHeader || document.getElementById('faqSearch')) return;
    
    const searchHTML = `
        <div class="faq-search" style="margin-top: 2rem;">
            <input 
                type="text" 
                id="faqSearch" 
                placeholder="Buscar en preguntas frecuentes..." 
                style="
                    width: 100%;
                    max-width: 500px;
                    padding: 1rem;
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius);
                    font-size: 1rem;
                    margin: 0 auto;
                    display: block;
                "
            >
        </div>
    `;
    
    faqHeader.insertAdjacentHTML('beforeend', searchHTML);
    initializeSearchIfExists();
}

// Auto-expand FAQ item from URL hash
function handleURLHash() {
    const hash = window.location.hash;
    if (!hash) return;
    
    const targetId = hash.substring(1);
    const targetItem = document.getElementById(targetId);
    
    if (targetItem && targetItem.classList.contains('faq-item')) {
        // Show the category containing this item
        const category = targetItem.closest('.faq-category');
        const categoryName = category.dataset.category;
        
        // Click the appropriate category button
        const categoryBtn = document.querySelector(`[data-category="${categoryName}"]`);
        if (categoryBtn) {
            categoryBtn.click();
        }
        
        // Expand the FAQ item
        setTimeout(() => {
            targetItem.querySelector('.faq-question').click();
            targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// Add IDs to FAQ items for direct linking
function addIDsToFAQItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question h3').textContent;
        const id = question.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
        
        item.id = `faq-${id}`;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addSearchToFAQ();
    addIDsToFAQItems();
    handleURLHash();
});

// Handle hash changes
window.addEventListener('hashchange', handleURLHash);

// Share FAQ functionality
function shareFAQ(faqItem) {
    const question = faqItem.querySelector('.faq-question h3').textContent;
    const answer = faqItem.querySelector('.faq-answer').textContent;
    const url = `${window.location.origin}${window.location.pathname}#${faqItem.id}`;
    
    const shareText = `${question}\n\n${answer}\n\nMás información en: ${url}`;
    
    if (navigator.share) {
        navigator.share({
            title: question,
            text: shareText,
            url: url
        }).then(() => {
            trackEvent('faq_shared', { question: question });
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Pregunta copiada al portapapeles');
            trackEvent('faq_shared', { question: question, method: 'clipboard' });
        }).catch(() => {
            // Fallback: WhatsApp share
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappUrl, '_blank');
            trackEvent('faq_shared', { question: question, method: 'whatsapp' });
        });
    }
}

// Print FAQ functionality
function printFAQ() {
    window.print();
    trackEvent('faq_printed');
}

// Contact CTA from FAQ
function contactFromFAQ(source) {
    trackEvent('faq_contact_initiated', { source: source });
    
    if (source === 'whatsapp') {
        const message = 'Hola, tengo una pregunta que no encontré en la sección de FAQ de CréditoFácil MX';
        const whatsappUrl = `https://wa.me/525512345678?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        window.location.href = 'contact.html?source=faq';
    }
}

// Analytics for FAQ engagement
function trackFAQEngagement() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const question = entry.target.querySelector('.faq-question h3').textContent;
                trackEvent('faq_question_viewed', { question: question });
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.faq-item').forEach(item => {
        observer.observe(item);
    });
}

// Initialize engagement tracking
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(trackFAQEngagement, 2000);
});

console.log('FAQ JavaScript loaded successfully');
