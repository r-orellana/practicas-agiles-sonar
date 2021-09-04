from backend.vistas.vistas import VistaAlbum, VistaAlbumesCanciones
from backend.vistas.vistas import VistaAlbumsUsuario, VistaCancion, VistaCancionesAlbum
from backend.vistas.vistas import VistaCancionesUsuario, VistaLogIn, VistaSignIn
import os
import tempfile
from backend import create_app
import pytest
from backend.modelos.modelos import Usuario, Cancion
from backend.modelos.modelos import db


from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from flask import json


@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app()
    app_context = app.app_context()
    app_context.push()
    db.init_app(app)
    db.drop_all()
    # Create the database and the database table
    db.create_all()

    # Insert user data
    user1 = Usuario(id=1, nombre="a@a", contrasena="1234")
    user2 = Usuario(id=2, nombre="b@b", contrasena="1234")
    cancion1 = Cancion(titulo='C1', minutos=5, segundos=12, interprete='I1')
    cancion2 = Cancion(titulo='C2', minutos=5, segundos=12, interprete='I1')
    cancion3 = Cancion(titulo='C3', minutos=5, segundos=12, interprete='I2')
    cancion4 = Cancion(titulo='C4', minutos=5, segundos=12, interprete='I2')
    user1.canciones.append(cancion1)
    user1.canciones.append(cancion2)

    user2.canciones.append(cancion3)
    user2.canciones.append(cancion4)

    db.session.add(user1)
    db.session.add(user2)

    # Commit the changes for the users
    db.session.commit()
    api = Api(app)
    api.add_resource(VistaCancionesUsuario, "/usuario/<int:id_usuario>/canciones")
    api.add_resource(VistaCancion, "/cancion/<int:id_cancion>")
    api.add_resource(VistaAlbumesCanciones, "/cancion/<int:id_cancion>/albumes")
    api.add_resource(VistaSignIn, "/signin")
    api.add_resource(VistaLogIn, "/logIn")
    api.add_resource(VistaAlbumsUsuario, "/usuario/<int:id_usuario>/albumes")
    api.add_resource(VistaAlbum, "/album/<int:id_album>")
    api.add_resource(VistaCancionesAlbum, "/album/<int:id_album>/canciones")
    jwt = JWTManager(app)
    cors = CORS(app)
    print(jwt)
    print(cors)
    with app.test_client() as client:
        yield client

    db.drop_all()
    db.create_all()

    os.close(db_fd)
    os.unlink(db_path)


def test_app(client):
    assert True


def test_Modificar_Modelo_Cancion_Usuario():
    cancion = Cancion()
    assert hasattr(cancion, 'usuario')
    usuario = Usuario()
    assert hasattr(usuario, 'canciones')


def test_login(client):
    data = {"nombre": "a@a", "contrasena": "1234"}
    response = client.post('/logIn', json=data, follow_redirects=True)
    assert response.status_code == 200


def test_get_canciones_usuario(client):
    response = client.get('/usuario/1/canciones')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert len(data) == 2


def test_put_canciones_usuario(client):
    data = {"titulo": "CPrueba", "minutos": 5, "segundos": 12, "interprete": "Unknown"}
    response = client.post('/usuario/1/canciones', json=data)
    print('****************')
    print(response.get_data(as_text=True))
    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert data['id'] > 0
