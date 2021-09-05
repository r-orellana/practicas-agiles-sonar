from backend.api import create_api
from backend import create_app
from .modelos import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = create_app()
app_context = app.app_context()
app_context.push()

db.init_app(app)
db.create_all()
cors = CORS(app)

create_api(app)

jwt = JWTManager(app)
