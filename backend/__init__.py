from typing import Dict

from flask import Flask


def create_app(config_dict: Dict = {}) -> Flask:
    app = Flask(__name__)
    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = f'sqlite:///{config_dict.get("DATABASE", "ionic")}.db'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "frase-secreta"
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["TESTING"] = config_dict.get("TESTING", False)
    return app
