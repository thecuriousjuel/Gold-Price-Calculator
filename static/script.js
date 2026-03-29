// Author: Biswajit Basak

function formatAmountToIndianCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount).replace('₹', 'Rs. ');
}

function loadMainPage() {
    const mainContainer = document.querySelector('#main-container');
    
    mainContainer.innerHTML = `
        <div class="card">
            <h1 class="card-title">
                <span class="material-icons">diamond</span>
                Gold Price Calculator
            </h1>
            
            <div class="input-field">
                <input id="weight" type="number" step="0.001" min="0" placeholder=" " required>
                <label for="weight">Gold Weight (grams)</label>
            </div>

            <div class="input-field">
                <input id="making" type="number" step="0.1" min="0" max="100" placeholder=" " required>
                <label for="making">Making Charge (%)</label>
            </div>

            <div class="input-field">
                <input id="rate" type="number" step="0.01" min="0" placeholder=" " required>
                <label for="rate">Rate per 10 grams (Rs.)</label>
            </div>

            <div class="input-field">
                <input id="hallmark" type="number" step="0.01" min="0" placeholder=" ">
                <label for="hallmark">Hallmark Price (Rs.)</label>
            </div>

            <div class="input-field">
                <input id="gst" type="number" step="0.1" value="3" placeholder=" " disabled>
                <label for="gst">GST (%)</label>
            </div>

            <button type="button" class="btn btn-primary" id="btn-calculate">
                <span class="material-icons">calculate</span> Calculate
            </button>
            <button type="button" class="btn btn-secondary" id="btn-clear">
                <span class="material-icons">clear</span> Clear
            </button>
            
            <div id="result-container"></div>
        </div>
    `;

    const weightInput = document.querySelector('#weight');
    const makingChargeInput = document.querySelector('#making');
    const goldRateInput = document.querySelector('#rate');
    const hallmarkInput = document.querySelector('#hallmark');
    const taxPercentInput = document.querySelector('#gst');
    
    // Load saved preferences
    const stored = localStorage.getItem("goldAppConfig");
    if (stored) {
        try {
            const config = JSON.parse(stored);
            if (config.making) makingChargeInput.value = config.making;
            if (config.rate) goldRateInput.value = config.rate;
            if (config.hallmark) hallmarkInput.value = config.hallmark;
        } catch (e) {
            console.error("Could not parse stored config");
        }
    }

    document.querySelector('#btn-calculate').addEventListener('click', () => {
        if (!weightInput.checkValidity()) {
            weightInput.reportValidity();
            return;
        }
        if (!makingChargeInput.checkValidity()) {
            makingChargeInput.reportValidity();
            return;
        }
        if (!goldRateInput.checkValidity()) {
            goldRateInput.reportValidity();
            return;
        }
        if (hallmarkInput && !hallmarkInput.checkValidity()) {
            hallmarkInput.reportValidity();
            return;
        }

        const weight = parseFloat(weightInput.value);
        const goldRate = parseFloat(goldRateInput.value);
        const makingChargePercent = parseFloat(makingChargeInput.value);
        const hallmarkPrice = hallmarkInput.value ? parseFloat(hallmarkInput.value) : 0;
        const taxPercent = parseFloat(taxPercentInput.value);

        // Core logic: applying making charge explicitly to the gold value
        const goldValue = (goldRate / 10) * weight;
        const makingChargeAmount = goldValue * (makingChargePercent / 100);
        const subtotal = goldValue + makingChargeAmount + hallmarkPrice;
        const taxAmount = subtotal * (taxPercent / 100);
        const totalPrice = subtotal + taxAmount;

        const resultsHTML = `
            <div class="results">
                <div class="result-row">
                    <span>Gold Value</span>
                    <span>${formatAmountToIndianCurrency(goldValue)}</span>
                </div>
                <div class="result-row">
                    <span>Making Charge (${makingChargePercent}%)</span>
                    <span>${formatAmountToIndianCurrency(makingChargeAmount)}</span>
                </div>
                ${hallmarkPrice > 0 ? `
                <div class="result-row">
                    <span>Hallmark Price</span>
                    <span>${formatAmountToIndianCurrency(hallmarkPrice)}</span>
                </div>
                ` : ''}
                <div class="result-row">
                    <span>Total before GST</span>
                    <span>${formatAmountToIndianCurrency(subtotal)}</span>
                </div>
                <div class="result-row">
                    <span>GST (${taxPercent}%)</span>
                    <span>${formatAmountToIndianCurrency(taxAmount)}</span>
                </div>
                <div class="result-row total">
                    <span>Total Price</span>
                    <span>${formatAmountToIndianCurrency(totalPrice)}</span>
                </div>
            </div>
        `;

        document.querySelector('#result-container').innerHTML = resultsHTML;

        // Save preferences to fill in automatically next time
        localStorage.setItem("goldAppConfig", JSON.stringify({
            rate: goldRate,
            making: makingChargePercent,
            hallmark: hallmarkPrice
        }));

        // Disable form values after calculation
        weightInput.disabled = true;
        makingChargeInput.disabled = true;
        goldRateInput.disabled = true;
        if (hallmarkInput) hallmarkInput.disabled = true;
        document.querySelector('#btn-calculate').disabled = true;
    });

    document.querySelector('#btn-clear').addEventListener('click', () => {
        weightInput.value = '';
        // Note: as per instructions, we keep making charge and rate intact
        document.querySelector('#result-container').innerHTML = '';

        // Re-enable input fields to allow new values
        weightInput.disabled = false;
        makingChargeInput.disabled = false;
        goldRateInput.disabled = false;
        if (hallmarkInput) hallmarkInput.disabled = false;
        document.querySelector('#btn-calculate').disabled = false;
    });
}

document.addEventListener('DOMContentLoaded', loadMainPage);