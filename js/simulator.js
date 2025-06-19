
// Loan Simulator Logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const amountSlider = document.getElementById('amount');
    const termSlider = document.getElementById('term');
    const amountDisplay = document.getElementById('amountDisplay');
    const termDisplay = document.getElementById('termDisplay');
    
    // Result displays
    const resultAmount = document.getElementById('resultAmount');
    const resultTerm = document.getElementById('resultTerm');
    const resultRate = document.getElementById('resultRate');
    const resultMonthly = document.getElementById('resultMonthly');
    const resultTotal = document.getElementById('resultTotal');
    const resultInterest = document.getElementById('resultInterest');
    const solicitarBtn = document.getElementById('solicitarBtn');
    
    if (!amountSlider || !termSlider) {
        console.error('Simulator elements not found');
        return;
    }
    
    // Load saved values from localStorage or URL parameters
    loadSavedValues();
    
    // Interest rate calculation based on amount and term
    function calculateInterestRate(amount, termMonths) {
        let baseRate = 15; // Base rate 15%
        
        // Rate adjustments based on amount
        if (amount >= 2000000) {
            baseRate = 13;
        } else if (amount >= 1000000) {
            baseRate = 14;
        } else if (amount >= 500000) {
            baseRate = 15;
        } else if (amount >= 200000) {
            baseRate = 16;
        } else {
            baseRate = 18;
        }
        
        // Rate adjustments based on term
        if (termMonths <= 12) {
            baseRate += 2; // Shorter terms have higher rates
        } else if (termMonths <= 24) {
            baseRate += 1;
        } else if (termMonths >= 60) {
            baseRate -= 1; // Longer terms have lower rates
        }
        
        // Ensure rate stays within reasonable bounds
        return Math.max(13, Math.min(20, baseRate));
    }
    
    // Monthly payment calculation using PMT formula
    function calculateMonthlyPayment(principal, rate, termMonths) {
        const monthlyRate = rate / 100 / 12;
        
        if (monthlyRate === 0) {
            return principal / termMonths;
        }
        
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                       (Math.pow(1 + monthlyRate, termMonths) - 1);
        
        return payment;
    }
    
    // Update all calculations
    function updateCalculations() {
        const amount = parseInt(amountSlider.value);
        const termMonths = parseInt(termSlider.value);
        const interestRate = calculateInterestRate(amount, termMonths);
        const monthlyPayment = calculateMonthlyPayment(amount, interestRate, termMonths);
        const totalPayment = monthlyPayment * termMonths;
        const totalInterest = totalPayment - amount;
        
        // Update displays
        amountDisplay.value = formatNumber(amount);
        termDisplay.value = termMonths;
        
        // Update results
        if (resultAmount) resultAmount.textContent = formatCurrency(amount);
        if (resultTerm) resultTerm.textContent = `${termMonths} meses`;
        if (resultRate) resultRate.textContent = `${interestRate.toFixed(1)}%`;
        if (resultMonthly) resultMonthly.textContent = formatCurrency(monthlyPayment);
        if (resultTotal) resultTotal.textContent = formatCurrency(totalPayment);
        if (resultInterest) resultInterest.textContent = formatCurrency(totalInterest);
        
        // Update solicitar button with current values
        if (solicitarBtn) {
            const url = new URL(solicitarBtn.href);
            url.searchParams.set('amount', amount);
            url.searchParams.set('term', termMonths);
            url.searchParams.set('rate', interestRate.toFixed(1));
            url.searchParams.set('monthly', Math.round(monthlyPayment));
            solicitarBtn.href = url.toString();
        }
        
        // Save current values
        saveCurrentValues(amount, termMonths, interestRate, monthlyPayment);
        
        // Track simulation event
        trackEvent('loan_simulation', {
            amount: amount,
            term: termMonths,
            rate: interestRate,
            monthly_payment: Math.round(monthlyPayment)
        });
        
        console.log('Simulation updated:', {
            amount,
            termMonths,
            interestRate,
            monthlyPayment: Math.round(monthlyPayment),
            totalPayment: Math.round(totalPayment),
            totalInterest: Math.round(totalInterest)
        });
    }
    
    // Save current simulation values
    function saveCurrentValues(amount, term, rate, monthly) {
        const simulationData = {
            amount: amount,
            term: term,
            rate: rate,
            monthly: Math.round(monthly),
            timestamp: new Date().toISOString()
        };
        
        saveToLocalStorage('lastSimulation', simulationData);
        
        // Also update URL parameters
        setUrlParameters({
            monto: amount,
            plazo: term
        });
    }
    
    // Load saved values from localStorage or URL
    function loadSavedValues() {
        // First check URL parameters
        const urlAmount = getUrlParameter('monto');
        const urlTerm = getUrlParameter('plazo');
        
        if (urlAmount && urlTerm) {
            const amount = Math.max(50000, Math.min(5000000, parseInt(urlAmount)));
            const term = Math.max(3, Math.min(84, parseInt(urlTerm)));
            
            amountSlider.value = amount;
            termSlider.value = term;
            updateCalculations();
            return;
        }
        
        // Then check localStorage
        const savedData = getFromLocalStorage('lastSimulation');
        if (savedData && savedData.amount && savedData.term) {
            amountSlider.value = savedData.amount;
            termSlider.value = savedData.term;
        }
        
        updateCalculations();
    }
    
    // Event listeners for sliders
    amountSlider.addEventListener('input', updateCalculations);
    termSlider.addEventListener('input', updateCalculations);
    
    // Allow direct input in display fields
    if (amountDisplay) {
        amountDisplay.addEventListener('change', function() {
            const value = this.value.replace(/[^0-9]/g, '');
            const amount = Math.max(50000, Math.min(5000000, parseInt(value) || 50000));
            amountSlider.value = amount;
            updateCalculations();
        });
    }
    
    if (termDisplay) {
        termDisplay.addEventListener('change', function() {
            const term = Math.max(3, Math.min(84, parseInt(this.value) || 3));
            termSlider.value = term;
            updateCalculations();
        });
    }
    
    // Initial calculation
    updateCalculations();
    
    console.log('Loan simulator initialized successfully');
});

// Reset simulator function
function resetSimulator() {
    const amountSlider = document.getElementById('amount');
    const termSlider = document.getElementById('term');
    
    if (amountSlider && termSlider) {
        amountSlider.value = 500000;
        termSlider.value = 24;
        
        // Trigger update
        const event = new Event('input');
        amountSlider.dispatchEvent(event);
        
        // Clear saved data
        removeFromLocalStorage('lastSimulation');
        
        // Clear URL parameters
        setUrlParameters({ monto: null, plazo: null });
        
        trackEvent('simulator_reset');
        
        showToast('Simulador reiniciado');
    }
}

// Quick amount buttons functionality
function setQuickAmount(amount) {
    const amountSlider = document.getElementById('amount');
    if (amountSlider) {
        amountSlider.value = amount;
        const event = new Event('input');
        amountSlider.dispatchEvent(event);
        
        trackEvent('quick_amount_selected', { amount: amount });
    }
}

// Quick term buttons functionality
function setQuickTerm(term) {
    const termSlider = document.getElementById('term');
    if (termSlider) {
        termSlider.value = term;
        const event = new Event('input');
        termSlider.dispatchEvent(event);
        
        trackEvent('quick_term_selected', { term: term });
    }
}

// Loan comparison functionality
function compareLoans() {
    const amount = parseInt(document.getElementById('amount').value);
    const currentTerm = parseInt(document.getElementById('term').value);
    
    const comparisons = [
        { term: 12, label: '12 meses' },
        { term: 24, label: '24 meses' },
        { term: 36, label: '36 meses' },
        { term: 48, label: '48 meses' }
    ].filter(comp => comp.term !== currentTerm);
    
    console.log('Loan Comparison for amount:', formatCurrency(amount));
    console.log('Current term:', currentTerm, 'months');
    
    comparisons.forEach(comp => {
        const rate = calculateInterestRate(amount, comp.term);
        const monthly = calculateMonthlyPayment(amount, rate, comp.term);
        const total = monthly * comp.term;
        
        console.log(`${comp.label}: ${formatCurrency(monthly)}/mes - Total: ${formatCurrency(total)}`);
    });
    
    trackEvent('loan_comparison', {
        amount: amount,
        current_term: currentTerm,
        comparisons_shown: comparisons.length
    });
}

// Share simulation functionality
function shareSimulation() {
    const amount = parseInt(document.getElementById('amount').value);
    const term = parseInt(document.getElementById('term').value);
    const rate = calculateInterestRate(amount, term);
    const monthly = calculateMonthlyPayment(amount, rate, term);
    
    const shareText = `Simulación de Préstamo CréditoFácil MX:
Monto: ${formatCurrency(amount)}
Plazo: ${term} meses
Pago mensual: ${formatCurrency(monthly)}
Tasa: ${rate.toFixed(1)}% anual

¡Simula tu préstamo en: ${window.location.origin}/simulador.html`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Simulación de Préstamo',
            text: shareText,
            url: window.location.href
        }).then(() => {
            trackEvent('simulation_shared', { method: 'native' });
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Simulación copiada al portapapeles');
            trackEvent('simulation_shared', { method: 'clipboard' });
        }).catch(() => {
            // Fallback: WhatsApp share
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappUrl, '_blank');
            trackEvent('simulation_shared', { method: 'whatsapp' });
        });
    }
}

// Print simulation functionality
function printSimulation() {
    const printContent = `
        <html>
        <head>
            <title>Simulación de Préstamo - CréditoFácil MX</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { color: #059669; font-size: 24px; font-weight: bold; }
                .simulation-details { margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .highlight { background: #f0f9f5; padding: 15px; border-left: 4px solid #059669; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">CréditoFácil MX</div>
                <h2>Simulación de Préstamo</h2>
                <p>Fecha: ${new Date().toLocaleDateString('es-MX')}</p>
            </div>
            
            <div class="simulation-details">
                <div class="detail-row">
                    <span>Monto Solicitado:</span>
                    <span>${document.getElementById('resultAmount').textContent}</span>
                </div>
                <div class="detail-row">
                    <span>Plazo:</span>
                    <span>${document.getElementById('resultTerm').textContent}</span>
                </div>
                <div class="detail-row">
                    <span>Tasa de Interés:</span>
                    <span>${document.getElementById('resultRate').textContent}</span>
                </div>
                <div class="highlight">
                    <div class="detail-row" style="border-bottom: none; font-weight: bold;">
                        <span>Pago Mensual:</span>
                        <span>${document.getElementById('resultMonthly').textContent}</span>
                    </div>
                </div>
                <div class="detail-row">
                    <span>Total a Pagar:</span>
                    <span>${document.getElementById('resultTotal').textContent}</span>
                </div>
                <div class="detail-row">
                    <span>Intereses Totales:</span>
                    <span>${document.getElementById('resultInterest').textContent}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>Esta simulación es únicamente informativa. Las condiciones finales pueden variar según la evaluación crediticia.</p>
                <p>CréditoFácil MX - Tel: +52 55 1234 5678 - info@creditofacil.mx</p>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    trackEvent('simulation_printed');
}

console.log('Simulator JavaScript loaded successfully');
