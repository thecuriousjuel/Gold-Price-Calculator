# Gold Price Calculator

A simple gold price calculator application built using HTML, CSS, and Vanilla JavaScript. 

This app allows users to input the current rate of gold, weight, making charges, and an optional hallmark price to accurately calculate the total purchasing price including GST. 

## Features

* **Dynamic Calculation**: Calculates the total price seamlessly by determining Gold Value, Making Charges, and combining them with Hallmark price before applying the fixed 3% GST.
* **Form Locking**: Upon running a calculation, the input fields and calculate button are disabled preventing edits and ensuring the displayed calculation cannot be altered without explicitly clicking "Clear".
* **Persistent Settings**: The latest inputs for "Rate per 10 grams", "Making Charge (%)", and "Hallmark Price" are saved using `localStorage` and automatically repopulated on the next visit.
* **Responsive Design**: Designed beautifully to be highly usable whether accessed from Desktop or Mobile web layouts.

## Calculation Workflow

The flow for the calculations is executed sequentially as follows:
1. **Gold Value** = `(Rate / 10) * Weight`
2. **Making Charges Amount** = `Gold Value * (Making Charge % / 100)`
3. **Subtotal Before GST** = `Gold Value + Making Charges Amount + Hallmark Price` 
4. **GST (3%)** = `Subtotal Before GST * 3%`
5. **Final Total Price** = `Subtotal Before GST + GST`