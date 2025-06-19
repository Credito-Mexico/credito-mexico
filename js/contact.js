// Contact Form Logic with Email.js Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your actual EmailJS user ID
    
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    
    // Load simulation data if available
    loadSimulationData();
    
    // Form submission handler
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Real-time validation
    setupRealTimeValidation();
    
    // Phone number formatting
    setupPhoneFormatting();
    
    console.log('Contact form initialized');
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        console.log('Form submission started');
        
        // Validate form
        if (!validateForm()) {
            showToast('Por favor, corrige los errores en el formulario', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Verify reCAPTCHA
            const recaptchaToken = await verifyRecaptcha();
            
            // Prepare form data
            const formData = collectFormData();
            formData.recaptcha_token = recaptchaToken;
            formData.reference_number = generateReferenceNumber();
            formData.submission_date = new Date().toISOString();
            
            console.log('Sending form data:', formData);
            
            // Send email via EmailJS
            await sendEmail(formData);
            
            // Save submission data
            saveSubmissionData(formData);
            
            // Show success
            showSuccessModal(formData.reference_number);
            
            // Reset form
            contactForm.reset();
            
            // Track conversion
            trackEvent('loan_application_submitted', {
                amount_range: formData.loanAmount,
                term_range: formData.loanTerm,
                reference: formData.reference_number
            });
            
            console.log('Form submitted successfully');
            
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Error al enviar la solicitud. Por favor, inténtalo de nuevo.', 'error');
            
            trackEvent('form_submission_error', {
                error: error.message
            });
        } finally {
            setLoadingState(false);
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
        });
        document.querySelectorAll('input, select').forEach(el => {
            el.classList.remove('error');
        });
        
        // Full name validation
        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName || fullName.length < 3) {
            showError('fullName', 'El nombre completo debe tener al menos 3 caracteres');
            isValid = false;
        } else if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(fullName)) {
            showError('fullName', 'El nombre solo puede contener letras y espacios');
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showError('email', 'El correo electrónico es obligatorio');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Por favor, ingresa un correo electrónico válido');
            isValid = false;
        }
        
        // Phone validation
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            showError('phone', 'El teléfono es obligatorio');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('phone', 'Por favor, ingresa un teléfono válido (10 dígitos mínimo)');
            isValid = false;
        }
        
        // Loan amount validation
        const loanAmount = document.getElementById('loanAmount').value;
        if (!loanAmount) {
            showError('loanAmount', 'Selecciona el monto deseado');
            isValid = false;
        }
        
        // Loan term validation
        const loanTerm = document.getElementById('loanTerm').value;
        if (!loanTerm) {
            showError('loanTerm', 'Selecciona el plazo deseado');
            isValid = false;
        }
        
        // Privacy policy validation
        const privacy = document.getElementById('privacy').checked;
        if (!privacy) {
            showError('privacy', 'Debes aceptar el Aviso de Privacidad y Términos y Condiciones');
            isValid = false;
        }
        
        console.log('Form validation result:', isValid);
        return isValid;
    }
    
    function collectFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            loanAmount: document.getElementById('loanAmount').value,
            loanTerm: document.getElementById('loanTerm').value,
            income: document.getElementById('income').value || 'No especificado',
            purpose: document.getElementById('purpose').value || 'No especificado',
            comments: document.getElementById('comments').value.trim() || 'Sin comentarios adicionales',
            marketing: document.getElementById('marketing').checked
        };
    }
    
    async function verifyRecaptcha() {
        return new Promise((resolve, reject) => {
            grecaptcha.ready(() => {
                grecaptcha.execute('6LfXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', { action: 'loan_application' })
                    .then(token => {
                        console.log('reCAPTCHA token obtained');
                        resolve(token);
                    })
                    .catch(reject);
            });
        });
    }
    
    async function sendEmail(formData) {
        const templateParams = {
            to_email: 'info@creditofacil.mx', // Replace with your email
            from_name: formData.fullName,
            from_email: formData.email,
            phone: formData.phone,
            loan_amount: formData.loanAmount,
            loan_term: formData.loanTerm,
            income: formData.income,
            purpose: formData.purpose,
            comments: formData.comments,
            reference: formData.reference_number,
            submission_date: new Date().toLocaleString('es-MX'),
            marketing_consent: formData.marketing ? 'Sí' : 'No'
        };
        
        // Send to company
        await emailjs.send(
            'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
            templateParams
        );
        
        // Send confirmation to customer
        const customerParams = {
            to_email: formData.email,
            customer_name: formData.fullName,
            reference: formData.reference_number,
            loan_amount: formData.loanAmount,
            loan_term: formData.loanTerm
        };
        
        await emailjs.send(
            'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
            'YOUR_CUSTOMER_TEMPLATE_ID', // Replace with your customer confirmation template ID
            customerParams
        );
        
        console.log('Emails sent successfully');
    }
    
    function loadSimulationData() {
        // Load from URL parameters first
        const urlAmount = getUrlParameter('amount');
        const urlTerm = getUrlParameter('term');
        const urlMonthly = getUrlParameter('monthly');
        
        if (urlAmount && urlTerm) {
            setLoanAmountFromValue(parseInt(urlAmount));
            setLoanTermFromValue(parseInt(urlTerm));
            console.log('Loaded simulation data from URL');
            return;
        }
        
        // Then try localStorage
        const savedData = getFromLocalStorage('lastSimulation');
        if (savedData && savedData.amount && savedData.term) {
            setLoanAmountFromValue(savedData.amount);
            setLoanTermFromValue(savedData.term);
            console.log('Loaded simulation data from localStorage');
        }
    }
    
    function setLoanAmountFromValue(amount) {
        const loanAmountSelect = document.getElementById('loanAmount');
        if (!loanAmountSelect) return;
        
        const options = loanAmountSelect.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const [min, max] = option.value.split('-').map(v => parseInt(v));
            
            if (amount >= min && (max ? amount <= max : true)) {
                loanAmountSelect.value = option.value;
                break;
            }
        }
    }
    
    function setLoanTermFromValue(term) {
        const loanTermSelect = document.getElementById('loanTerm');
        if (!loanTermSelect) return;
        
        const options = loanTermSelect.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const [min, max] = option.value.split('-').map(v => parseInt(v));
            
            if (term >= min && term <= max) {
                loanTermSelect.value = option.value;
                break;
            }
        }
    }
    
    function setupRealTimeValidation() {
        // Full name validation
        const fullNameInput = document.getElementById('fullName');
        fullNameInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && value.length >= 3 && /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
                hideError('fullName');
            }
        });
        
        // Email validation
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && validateEmail(value)) {
                hideError('email');
            }
        });
        
        // Phone validation
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && validatePhone(value)) {
                hideError('phone');
            }
        });
        
        // Select validations
        document.getElementById('loanAmount').addEventListener('change', function() {
            if (this.value) hideError('loanAmount');
        });
        
        document.getElementById('loanTerm').addEventListener('change', function() {
            if (this.value) hideError('loanTerm');
        });
        
        document.getElementById('privacy').addEventListener('change', function() {
            if (this.checked) hideError('privacy');
        });
    }
    
    function setupPhoneFormatting() {
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length <= 10) {
                // Format as: 55 1234 5678
                if (value.length > 6) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '$1 $2 $3');
                } else if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d{0,4})/, '$1 $2');
                }
            } else {
                // Format as: +52 55 1234 5678
                value = value.replace(/(\d{2})(\d{2})(\d{4})(\d{0,4})/, '+$1 $2 $3 $4');
            }
            
            this.value = value;
        });
    }
    
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }
    
    function saveSubmissionData(formData) {
        const submissionData = {
            ...formData,
            id: formData.reference_number,
            timestamp: new Date().toISOString(),
            status: 'submitted'
        };
        
        // Save to localStorage for reference
        saveToLocalStorage(`submission_${formData.reference_number}`, submissionData);
        
        // Save to submissions list
        let submissions = getFromLocalStorage('loan_submissions') || [];
        submissions.push({
            id: formData.reference_number,
            name: formData.fullName,
            amount: formData.loanAmount,
            date: new Date().toISOString(),
            status: 'submitted'
        });
        
        // Keep only last 10 submissions
        if (submissions.length > 10) {
            submissions = submissions.slice(-10);
        }
        
        saveToLocalStorage('loan_submissions', submissions);
    }
    
    function showSuccessModal(referenceNumber) {
        const modal = document.getElementById('successModal');
        const referenceSpan = document.getElementById('referenceNumber');
        
        if (modal && referenceSpan) {
            referenceSpan.textContent = referenceNumber;
            modal.style.display = 'flex';
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                closeModal();
            }, 10000);
        }
    }
});

// Close modal function
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Redirect to home page after closing
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Modal click outside to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Quick contact functions
function callNow() {
    window.location.href = 'tel:+525512345678';
    trackEvent('phone_call_initiated');
}

function chatWhatsApp() {
    const message = 'Hola, me interesa obtener más información sobre los préstamos de CréditoFácil MX';
    const whatsappUrl = `https://wa.me/525512345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    trackEvent('whatsapp_chat_initiated');
}

// Form recovery functionality
function saveFormDraft() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        loanAmount: document.getElementById('loanAmount').value,
        loanTerm: document.getElementById('loanTerm').value,
        income: document.getElementById('income').value,
        purpose: document.getElementById('purpose').value,
        comments: document.getElementById('comments').value,
        timestamp: new Date().toISOString()
    };
    
    saveToLocalStorage('contact_form_draft', formData);
}

function loadFormDraft() {
    const draft = getFromLocalStorage('contact_form_draft');
    if (draft) {
        Object.keys(draft).forEach(key => {
            const element = document.getElementById(key);
            if (element && draft[key]) {
                element.value = draft[key];
            }
        });
        
        showToast('Se recuperó un borrador de tu formulario', 'info');
    }
}

// Auto-save draft every 30 seconds
setInterval(() => {
    const form = document.getElementById('contactForm');
    if (form && form.querySelector('input[type="text"], input[type="email"], input[type="tel"], select, textarea').value) {
        saveFormDraft();
    }
}, 30000);

// Load draft on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadFormDraft, 1000);
});

console.log('Contact form JavaScript loaded successfully');
