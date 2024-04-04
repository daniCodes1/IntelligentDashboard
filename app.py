# Imports
from flask import Flask, render_template, redirect, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# My app
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)

# Create Model
# Data class = Row of data
class MyEvent(db.Model):
    # ID is unique:
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(100), nullable=False)
    complete = db.Column(db.Integer, default=0)
    created = db.Column(db.DateTime, default=datetime.utcnow) # TO DO: PST

    # Give data back
    def __repr__(self) -> str:
        return f"Event {self.id}"

# Project folders:
# Each page will be an HTML file
# Static will contain CSS + JS
# Templates will contain the HTML pages

# Home page
@app.route("/", methods=["POST", "GET"])
def index():
    # Add an event
    if request.method == "POST":
        current_event = request.form['content']
        new_event = MyEvent(content=current_event)
        # Try to establish a database connection
        try: 
            db.session.add(new_event)
            db.session.commit()
            # Return to home page
            return redirect("/")
        except Exception as e:
            print(f"Error: {e}")
            return f"Error: {e}"
        
    # See all current events
    return render_template("index.html")



if __name__ in "__main__":
    with app.app_context():
        # Create the database
        db.create_all()
    app.run(debug=True)



