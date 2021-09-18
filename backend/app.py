from flask_cors import CORS
from flask_jwt_extended import JWTManager

from backend import create_app
from backend.api import create_api

from .modelos import db

app = create_app()
app_context = app.app_context()
app_context.push()

db.init_app(app)
db.create_all()
cors = CORS(app)

create_api(app)

jwt = JWTManager(app)
