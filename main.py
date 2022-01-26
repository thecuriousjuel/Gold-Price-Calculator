from flask import Flask, render_template
from flask import request


app = Flask(__name__)

@app.route('/calculate', methods=['POST'])
def calculate():

    weight = float(request.form['weight'])
    making_charge = float(request.form['making'])
    gold_rate = float(request.form['rate'])
    gst = float(request.form['gst'])

    if weight > 1:
        making_price_per_gram = gold_rate + ((making_charge/100) * gold_rate)
        gold_price = making_price_per_gram * weight

    else:
        
        gold_price = (gold_rate * weight) + making_charge


    total_gst = gold_price * (gst/100)
    total_price = gold_price + total_gst

    price_dict = dict(total_gst=total_gst, total_price=total_price)

    return price_dict

    
@app.route('/')
def homepage():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)

