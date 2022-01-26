from flask import Flask, render_template
from flask import request
import sqlite3


app = Flask(__name__)

def currency_format(number):
    number = str(number)
    n_list = number.split('.')

    n = n_list[0][::-1]
    w = ''
    c = 3

    for i in range(len(n)):
        if n[i] == '.':
            w += n[i]
        
        elif len(w) == c:
            w += ',' + n[i]
            c += 3
            continue
            
        w += n[i]
        
    return w[::-1] + '.' + n_list[1]  


def get_today_rate(value=''):
    conn = sqlite3.connect('Rate.db')
    try:
        today_date = list(conn.execute('SELECT DATE();'))[0][0]
        output = conn.execute(f"SELECT RATE FROM GOLD_RATE WHERE DATE='{today_date}';")
        value = list(output)[0][0]

    except IndexError:
         return

    except sqlite3.OperationalError:
        conn.execute("""CREATE TABLE GOLD_RATE (DATE DATE PRIMARY KEY, RATE FLOAT)""")
        conn.commit()
        return
    finally:
        conn.close()
        return value
    


def store_today_gold_rate(gold_rate):
    conn = sqlite3.connect('Rate.db')
    today_date = list(conn.execute('SELECT DATE();'))[0][0]

    try:
        conn.execute(f"""INSERT INTO GOLD_RATE (DATE, RATE) VALUES ('{today_date}', '{gold_rate}')""")
        conn.commit()
        conn.close()
        
    except sqlite3.IntegrityError:
        conn.execute(f"UPDATE GOLD_RATE SET RATE = {gold_rate} WHERE DATE = '{today_date}'")
        conn.commit()
        conn.close()


def give_alert(value):
    return "<script>alert(f'Enter {value}')</script>"


@app.route('/calculate', methods=['POST'])
def calculate():
    
    weight = float(request.form['weight'])
    making_charge = float(request.form['making'])
    gold_rate = float(request.form['rate'])
    gst = float(request.form['gst'])

    store_today_gold_rate(round(gold_rate, 2))

    
    if weight > 1:
        making_price_per_gram = gold_rate + ((making_charge/100) * gold_rate)
        gold_price = making_price_per_gram * weight

    else:
        gold_price = (gold_rate * weight) + making_charge


    total_gst = gold_price * (gst/100)
    total_price = gold_price + total_gst

    price_dict = dict(gold_price=currency_format(round(gold_price,2)),
                     total_gst=currency_format(round(total_gst,2)), 
                     total_price=currency_format(round(total_price, 2)))

    return render_template('index.html', price_dict=price_dict)


@app.route('/', methods=['GET'])
def homepage():
    rate = get_today_rate()

    return render_template('index.html', rate=rate)


if __name__ == '__main__':
    app.run(debug=True)

