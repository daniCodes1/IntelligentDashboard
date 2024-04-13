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
    evDate = db.Column(db.DateTime, default=datetime.utcnow)  # TO DO: PST

    # Give data back
    def __repr__(self) -> str:
        return f"Event {self.id}"


# Home page
@app.route("/")
def index():
    return render_template("dashboard.html")


@app.route("/delete/<int:id>")
# ID will be an integer
def delete(id):
    delete_event = MyEvent.query.get_or_404(id)
    try:
        db.session.delete(delete_event)
        db.session.commit()
        return redirect("/calendar")
    except Exception as e:
        return f"Error: {e}"


# Get to calendar page

@app.route("/calendar", methods=["POST", "GET"])
# Add an event
def calendar():
    if request.method == "POST":
        current_event = request.form['content']
        event_date = request.form['event-date']
        # Convert to Python datetime object
        event_date_py = datetime.strptime(event_date, "%Y-%m-%d")
        new_event = MyEvent(content=current_event, evDate=event_date_py)

        # Try to establish a database connection
        try:
            db.session.add(new_event)
            db.session.commit()
            # Return to home page
            return redirect("/calendar")

        except Exception as e:
            print(f"Error: {e}")
            return f"Error: {e}"

    # See all current events
    else:
        # Sort by calendar events by date
        events = MyEvent.query.order_by(MyEvent.evDate).all()
        return render_template("calendar.html", events=events)

# Edit a calendar event


@app.route("/edit/<int:id>", methods=['GET', 'POST'])
def edit(id):
    ev = MyEvent.query.get_or_404(id)
    if request.method == "POST":
        ev.content = request.form['content']
        ev.evDate = datetime.strptime(request.form['event-date'], "%Y-%m-%d")
        try:
            db.session.commit()
            return redirect("/calendar")
        except Exception as e:
            return f"Error: {e}"
    else:
        # Event gets used in the html
        return render_template('edit.html', event=ev)


if __name__ in "__main__":
    with app.app_context():
        # Create the database
        db.create_all()
    app.run(debug=True)
