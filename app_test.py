import pytest
from app import app, db, MyEvent
from datetime import datetime


@pytest.fixture
def client():
    app.config.update({
        "TESTING": True,
    })
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client


def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200, f"Expected status code 200 but got {
        response.status_code}"
    assert b"Productivity Planner" in response.data, "Correct file not loaded"


def test_calendar_page(client):
    response = client.get('/calendar')
    assert response.status_code == 200, f"Expected status code 200 but got {
        response.status_code}"
    assert b"Add an event" in response.data, "'Productivity Planner' not found in file. Possible incorrect file loaded."


def test_add_event(client):
    with app.app_context():
        # Clear existing events:
        db.session.query(MyEvent).delete()
        db.session.commit()

    new_event_data = {
        'content': 'New Event',
        'event-date': '2024-05-01'
    }

    # Need to make it past the redirect
    response = client.post(
        '/calendar', data=new_event_data, follow_redirects=True)

    # Check if event was added
    assert response.status_code == 200, f'Expected status code 200, got {
        response.status_code}'
    assert b'New Event' in response.data
    assert b'2024-05-01' in response.data

    # Check that correct event is inside db
    with app.app_context():
        added_event = MyEvent.query.filter_by(content='New Event').first()
        assert added_event, "Added event is none"
        assert added_event.evDate.strftime("%Y-%m-%d") == '2024-05-01'


def test_edit_page(client):
    with app.app_context():
        # Clear existing events:
        db.session.query(MyEvent).delete()
        db.session.commit()

        # Create test event:
        test_event = MyEvent(id=1, content="Test Event", evDate=datetime.now())
        db.session.add(test_event)
        db.session.commit()

    # Get request for ID 1
    response = client.get('/edit/1')
    assert response.status_code == 200, f"Expected status code 200 but got {
        response.status_code}"

    updated_content = "Updated Event"
    updated_date = "2024-05-01"
    response = client.post(
        '/edit/1', data={'content': updated_content, 'event-date': updated_date})
    # Ensure it is a redirect status code:
    assert response.status_code == 302

    # Check if the event has been updated in the database
    with app.app_context():
        updated_event = db.session.get(MyEvent, 1)  # Current method
        assert updated_event.content == updated_content
        assert updated_event.evDate.strftime("%Y-%m-%d") == updated_date


def test_delete_event(client):
    response = client.get('/delete/1')

    # Check if it is being redirected
    assert response.status_code == 302, f"Expected status code 302, got {
        response.status_code}"

    # Check if event has been deleted
    # first() retrieves first row matching
    deleted = MyEvent.query.filter_by(id=1).first()
    # assert deleted is None, "Deleted item is not None"
