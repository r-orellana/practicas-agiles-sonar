from backend.api import create_api
import os
import tempfile
from flask_jwt_extended import JWTManager
from flask_cors import CORS

import pytest

from backend import create_app
from backend.modelos import db


@pytest.fixture(scope="session")
def app():
    """Create and configure a new app instance for each test."""
    # create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    # create the app with common test config
    app = create_app({"TESTING": True, "DATABASE": db_path})
    app_context = app.app_context()
    app_context.push()

    # create the database
    db.init_app(app)
    db.create_all()

    create_api(app)
    JWTManager(app)
    CORS(app)

    yield app

    # close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture(scope="function")
def client(app):
    db.drop_all()
    db.create_all()
    """A test client for the app."""
    return app.test_client()
