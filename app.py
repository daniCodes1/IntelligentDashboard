# Imports
from flask import Flask
from flask_scss import Scss
from flask_sqlalchemy import SQLAlchemy

# My app
app = Flask(__name__)

# Project folders:
# Each page will be an HTML file
# Static will contain CSS + JS
# Templates will contain the HTML pages
@app.route("/")
def index():
    return "Testing 123"


if __name__ in "__main__":
    app.run(debug=True)



