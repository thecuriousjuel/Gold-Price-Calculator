// Author: Biswajit Basak

// Event Listener
document.addEventListener('DOMContentLoaded', loadMainPage)


// Functions

function formatAmountToIndianCurrency(amount) {
    const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    const formattedWithRs = formatted.replace('₹', 'Rs. ');
    return formattedWithRs;
}

function loadMainPage() {
    const heading = `
        <div class="d-flex justify-content-center border border-dark">
            <h1>Gold Price Calculator</h1>
        </div>`

    const body = `
    <div>
        <div class="mb-3 row">
            <label for="weight" class="col-sm-2 col-form-label">Gold Weight</label>
            <div class="col-sm-10">
            <input name="weight" id="weight" type="number" step="0.001" class="form-control form-control-lg" placeholder="grams" min=0 required>
            </div>
        </div>

        <div class="mb-3 row">
            <label for="making" class="col-sm-2 col-form-label">Making Charge (%)</label>
            <div class="col-sm-10">
                <input name="making" id="making" type="number" step="1" class="form-control form-control-lg" placeholder="%" min=0 max=100 required>
            </div>
        </div>

        <div class="mb-3 row">
            <label for="rate" class="col-sm-2 col-form-label">Rate per 10 grams</label>
            <div class="col-sm-10">
                <input name="rate" id="rate" type="number" step="0.001" class="form-control form-control-lg" placeholder="Rs. per grams" min=0 required>
            </div>
        </div>

        <div class="mb-3 row">
            <label for="gst" class="col-sm-2 col-form-label">GST (%)</label>
            <div class="col-sm-10">
                <input name="gst" id="gst" type="number" step="0.001" class="form-control form-control-lg" value="3" readonly disabled>
            </div>
        </div>
        <div class="action">
            <button type="button" class="btn btn-lg btn-primary mb-3">Get Price</button>
            <button type="button" class="btn btn-lg btn-danger mb-3">Clear</button>
        </div>
    </div>`

    const mainContainer = document.querySelector('#main-container');
    mainContainer.innerHTML = heading + "</br>" + body;

    const stored = localStorage.getItem("goldMetaData");
    let goldMetaData = stored ? JSON.parse(stored) : null;

    const weightInput = document.querySelector('#weight');
    const makingChargeInput = document.querySelector('#making');
    const goldRateInput = document.querySelector('#rate');
    const taxPercentInput = document.querySelector('#gst');

    const currentDate = new Date().toDateString();

    if (goldMetaData) {
        const storedDate = goldMetaData["date"]
        if (storedDate == currentDate) {
            goldRateInput.value = goldMetaData["rate"]
        }
    }

    const calculateButtonEventListener = document.querySelector('.btn-primary');
    const clearButtonEventListener = document.querySelector(".btn-danger");

    calculateButtonEventListener.addEventListener('click', (event) => {
        if (!weightInput.checkValidity()) {
            weightInput.reportValidity();
        } else if (!makingChargeInput.checkValidity()) {
            makingChargeInput.reportValidity();
        } else if (!goldRateInput.checkValidity()) {
            goldRateInput.reportValidity()
        }
        else {
            const weight = parseFloat(weightInput.value);
            const goldRate = parseFloat(goldRateInput.value);
            const markingCharge = parseFloat(makingChargeInput.value);
            const taxPercent = parseFloat(taxPercentInput.value);

            // Step 1: Add 12% making charge
            const priceWithMaking = (goldRate / 10) * (1 + (markingCharge / 100));
            // Step 2: Multiply by weight
            const subtotal = priceWithMaking * weight;
            // Step 3: Calculate tax amount
            const taxAmount = subtotal * (taxPercent / 100);
            // Step 4: Final price
            const totalPrice = subtotal + taxAmount;

            const totalPriceBreakdown = `
                <table border="1" class="table">
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
            
                    <tr>
                        <td>Gold Price</td>
                        <td>${formatAmountToIndianCurrency(subtotal)}</td>
                    </tr>
            
                    <tr>
                        <td>Total GST (${taxPercent}%)</td>
                        <td>${formatAmountToIndianCurrency(taxAmount)}</td>
                    </tr>
            
                    <tr>
                        <td>Total Price with GST</td>
                        <td><strong>${formatAmountToIndianCurrency(totalPrice)}</strong></td>
                    </tr>
            
              </table>`

            mainContainer.innerHTML += "<br/>" + totalPriceBreakdown

            goldMetaData = {
                "rate": goldRate,
                "date": currentDate
            }
            localStorage.setItem("goldMetaData", JSON.stringify(goldMetaData))
        }
    })

    clearButtonEventListener.addEventListener('click', (event) => {
        console.log('working')
        loadMainPage();
    })
}