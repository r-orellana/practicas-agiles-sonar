from backend.modelos.modelos import Usuario, Cancion
from backend.modelos.modelos import db

from flask import json

# ------- Fixture Data -------
user1_data = {"nombre": "a@a", "contrasena": "1234"}
user2_data = {"nombre": "b@b", "contrasena": "1234"}
cancion1_data = {"titulo": "C1", "minutos": 5, "segundos": 12, "interprete": "I1"}
cancion2_data = {"titulo": "C2", "minutos": 5, "segundos": 12, "interprete": "I1"}
cancion3_data = {"titulo": "C3", "minutos": 5, "segundos": 12, "interprete": "I2"}
cancion4_data = {"titulo": "C4", "minutos": 5, "segundos": 12, "interprete": "I2"}


# ------- Tests --------
def test_modificar_modelo_cancion_usuario():
    cancion = Cancion()
    usuario = Usuario()
    assert hasattr(cancion, "usuario")
    assert hasattr(usuario, "canciones")


def test_login(client):
    # Arrange
    user1 = Usuario(**user1_data)
    db.session.add(user1)
    db.session.commit()

    # Act
    response = client.post("/logIn", json=user1_data, follow_redirects=True)

    # Assert
    assert response.status_code == 200


def test_get_canciones_usuario(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    cancion1 = Cancion(**cancion1_data)
    cancion2 = Cancion(**cancion2_data)
    cancion3 = Cancion(**cancion3_data)
    cancion4 = Cancion(**cancion4_data)
    user1.canciones.append(cancion1)
    user1.canciones.append(cancion2)
    user2.canciones.append(cancion3)
    user2.canciones.append(cancion4)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    # Act
    response = client.get("/usuario/1/canciones")
    data = json.loads(response.get_data(as_text=True))

    # Assert
    assert response.status_code == 200
    assert len(data) == 2


def test_put_canciones_usuario(client):
    # Arrange
    user1 = Usuario(**user1_data)
    db.session.add(user1)
    db.session.commit()

    # Act
    response = client.post("/usuario/1/canciones", json=cancion1_data)
    data = json.loads(response.get_data(as_text=True))

    # Assert
    assert response.status_code == 200
    assert data["id"] == 1
