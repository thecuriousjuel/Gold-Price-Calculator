// Author: Biswajit Basak

// Event Listener
document.addEventListener('DOMContentLoaded', loadMainPage)


// Functions

function loadMainPage(){
    const heading = `
        <div class="d-flex justify-content-center border border-dark">
            <h1>Gold Price Calculator</h1>
        </div>`
    
    const body = `
    <div>
        <div class="mb-3 row">
            <label for="weight" class="col-sm-2 col-form-label">Gold Weight</label>
            <div class="col-sm-10">
            <input name="weight" id="weight" type="number" step="0.001" class="form-control form-control-lg" placeholder="Enter in grams" min=0 required>
            </div>
        </div>

        <div class="mb-3 row">
            <label for="making" class="col-sm-2 col-form-label">Making Charge</label>
            <div class="col-sm-10">
                <input name="making" id="making" type="number" step="0.001" class="form-control form-control-lg" placeholder="Enter here" min=0  required>
            </div>
        </div>

        <div class="mb-3 row">
            <label for="rate" class="col-sm-2 col-form-label">Rate per 10 grams</label>
            <div class="col-sm-10">
                <input name="rate" id="rate" type="number" step="0.001" class="form-control form-control-lg" placeholder="Enter here" min=0 value="{{rate}}" required>
            </div>
        </div>

        <div class="mb-3 row">
            <label for="gst" class="col-sm-2 col-form-label">GST (%)</label>
            <div class="col-sm-10">
                <input name="gst" id="gst" type="number" step="0.001" class="form-control form-control-lg" value="3" readonly disabled>
            </div>
        </div>
        
        <button type="button" class="btn btn-lg btn-primary mb-3">Get Price</button>

    </div>`

    const mainContainer = document.querySelector('#main-container');
    mainContainer.innerHTML = heading + "</br>" +body;

    const buttonEventListener = document.querySelector('.btn');
    buttonEventListener.addEventListener('click', (event) => {
        const weightInput = document.querySelector('#weight');
        const makingChargeInput = document.querySelector('#making');
        const goldRateInput = document.querySelector('#rate');

        if (!weightInput.checkValidity()){
            weightInput.reportValidity();
        }else{

            const weight = weightInput.value;
            console.log(weight)
        }

    //     const totalPriceBreakdown = `
    //     <table border="1" class="table">
    //         <tr>
    //             <th>Description</th>
    //             <th>Amount</th>
    //         </tr>

    //         <tr>
    //             <td>Gold Price</td>
    //             <td>Rs. ${}</td>
    //         </tr>

    //         <tr>
    //             <td>Total GST (3%)</td>
    //             <td>Rs. ${}</td>
    //         </tr>

    //         <tr>
    //             <td>Total Price with GST</td>
    //             <td>Rs. ${}</td>
    //         </tr>

    //   </table>`
    })
}