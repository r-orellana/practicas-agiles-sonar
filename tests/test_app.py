from flask import json

from backend.modelos.modelos import Album, Cancion, Usuario, db

# ------- Fixture Data -------
user1_data = {"nombre": "a@a", "contrasena": "1234"}
user2_data = {"nombre": "b@b", "contrasena": "12345"}
user3_data = {"nombre": "c@c", "contrasena": "123456"}
cancion1_data = {"titulo": "C1", "minutos": 5, "segundos": 12, "interprete": "I1"}
cancion2_data = {"titulo": "C2", "minutos": 6, "segundos": 13, "interprete": "I2"}
cancion3_data = {"titulo": "C3", "minutos": 7, "segundos": 14, "interprete": "I1"}
cancion4_data = {"titulo": "C4", "minutos": 8, "segundos": 15, "interprete": "I2"}
album1_data = {"titulo": "A1", "anio": 1995, "descripcion": "D1", "medio": "DISCO"}
album2_data = {"titulo": "A2", "anio": 1996, "descripcion": "D2", "medio": "CASETE"}
album3_data = {"titulo": "A3", "anio": 1997, "descripcion": "D3", "medio": "CD"}
album4_data = {"titulo": "A4", "anio": 1998, "descripcion": "D4", "medio": "DISCO"}


# ------- Tests --------
def test_modificar_modelos():
    # Act
    album = Album()
    cancion = Cancion()
    usuario = Usuario()

    # Assert
    assert hasattr(album, "usuarios_compartidos")
    assert hasattr(cancion, "usuario")
    assert hasattr(usuario, "canciones")
    assert hasattr(usuario, "albumes_compartidos")


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
    assert data[0]["titulo"] == cancion1_data["titulo"]
    assert data[1]["titulo"] == cancion2_data["titulo"]


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
    assert data["titulo"] == cancion1_data["titulo"]


def test_compartir_album(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    album1 = Album(**album1_data)
    user1.albumes.append(album1)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/album-compartido/1", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    response = client.get("/usuario/2/album-compartido/1", headers=headers)
    data = json.loads(response.get_data(as_text=True))

    response_all = client.get("/usuario/2/albumes-compartidos", headers=headers)
    data_all = json.loads(response_all.get_data(as_text=True))

    # Assert
    assert post_response.status_code == 200
    assert post_data["titulo"] == album1_data["titulo"]

    assert response.status_code == 200
    assert data["titulo"] == album1_data["titulo"]

    assert response_all.status_code == 200
    assert len(data_all) == 1
    assert data_all[0]["titulo"] == album1_data["titulo"]
    assert len(data_all[0]["usuarios_compartidos"]) == 1


def test_compartir_album_varios_usuarios(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    user3 = Usuario(**user3_data)
    album1 = Album(**album1_data)
    user1.albumes.append(album1)
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/album-compartido/1", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    post_response2 = client.post("/usuario/3/album-compartido/1", headers=headers)
    post_data2 = json.loads(post_response.get_data(as_text=True))

    response = client.get("/usuario/2/album-compartido/1", headers=headers)
    data = json.loads(response.get_data(as_text=True))

    response2 = client.get("/usuario/3/album-compartido/1", headers=headers)
    data2 = json.loads(response.get_data(as_text=True))

    response_all = client.get("/usuario/2/albumes-compartidos", headers=headers)
    data_all = json.loads(response_all.get_data(as_text=True))

    response_all2 = client.get("/usuario/3/albumes-compartidos", headers=headers)
    data_all2 = json.loads(response_all.get_data(as_text=True))

    # Assert
    assert post_response.status_code == 200
    assert post_data["titulo"] == album1_data["titulo"]

    assert post_response2.status_code == 200
    assert post_data2["titulo"] == album1_data["titulo"]

    assert response.status_code == 200
    assert data["titulo"] == album1_data["titulo"]

    assert response2.status_code == 200
    assert data2["titulo"] == album1_data["titulo"]

    assert response_all.status_code == 200
    assert len(data_all) == 1
    assert data_all[0]["titulo"] == album1_data["titulo"]
    assert len(data_all[0]["usuarios_compartidos"]) == 2

    assert response_all2.status_code == 200
    assert len(data_all2) == 1
    assert data_all2[0]["titulo"] == album1_data["titulo"]
    assert len(data_all2[0]["usuarios_compartidos"]) == 2


def test_usuario_sin_album_compartido(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    user3 = Usuario(**user3_data)
    album1 = Album(**album1_data)
    user1.albumes.append(album1)
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/album-compartido/1", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    response = client.get("/usuario/3/album-compartido/1", headers=headers)
    data = response.get_data(as_text=True)

    response_all = client.get("/usuario/3/albumes-compartidos", headers=headers)
    data_all = json.loads(response_all.get_data(as_text=True))

    # Assert
    # Assert
    assert post_response.status_code == 200
    assert post_data["titulo"] == album1_data["titulo"]

    assert response.status_code == 403
    assert "Album no esta compartido con el usuario" in data

    assert response_all.status_code == 200
    assert len(data_all) == 0


def test_usuario_comparte_album_ajeno(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    album1 = Album(**album1_data)
    album2 = Album(**album2_data)
    user1.albumes.append(album1)
    user2.albumes.append(album2)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/album-compartido/2", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    # Assert
    # Assert
    assert post_response.status_code == 405
    assert "Album no pertenece al usuario" in post_data


def test_compartir_cancion(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    cancion1 = Cancion(**cancion1_data)
    user1.canciones.append(cancion1)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/cancion-compartida/1", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    response = client.get("/usuario/2/cancion-compartida/1", headers=headers)
    data = json.loads(response.get_data(as_text=True))

    response_all = client.get("/usuario/2/canciones-compartidas", headers=headers)
    data_all = json.loads(response_all.get_data(as_text=True))

    # Assert
    assert post_response.status_code == 200
    assert post_data["titulo"] == cancion1_data["titulo"]

    assert response.status_code == 200
    assert data["titulo"] == cancion1_data["titulo"]

    assert response_all.status_code == 200
    assert len(data_all) == 1
    assert data_all[0]["titulo"] == cancion1_data["titulo"]
    assert len(data_all[0]["usuarios_compartidos"]) == 1


def test_compartir_cancion_varios_usuarios(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    user3 = Usuario(**user3_data)
    cancion1 = Cancion(**cancion1_data)
    user1.canciones.append(cancion1)
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/cancion-compartida/1", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    post_response2 = client.post("/usuario/3/cancion-compartida/1", headers=headers)
    post_data2 = json.loads(post_response.get_data(as_text=True))

    response = client.get("/usuario/2/cancion-compartida/1", headers=headers)
    data = json.loads(response.get_data(as_text=True))

    response2 = client.get("/usuario/3/cancion-compartida/1", headers=headers)
    data2 = json.loads(response.get_data(as_text=True))

    response_all = client.get("/usuario/2/canciones-compartidas", headers=headers)
    data_all = json.loads(response_all.get_data(as_text=True))

    response_all2 = client.get("/usuario/3/canciones-compartidas", headers=headers)
    data_all2 = json.loads(response_all.get_data(as_text=True))

    # Assert
    assert post_response.status_code == 200
    assert post_data["titulo"] == cancion1_data["titulo"]

    assert post_response2.status_code == 200
    assert post_data2["titulo"] == cancion1_data["titulo"]

    assert response.status_code == 200
    assert data["titulo"] == cancion1_data["titulo"]

    assert response2.status_code == 200
    assert data2["titulo"] == cancion1_data["titulo"]

    assert response_all.status_code == 200
    assert len(data_all) == 1
    assert data_all[0]["titulo"] == cancion1_data["titulo"]
    assert len(data_all[0]["usuarios_compartidos"]) == 2

    assert response_all2.status_code == 200
    assert len(data_all2) == 1
    assert data_all2[0]["titulo"] == cancion1_data["titulo"]
    assert len(data_all2[0]["usuarios_compartidos"]) == 2


def test_usuario_sin_cancion_compartida(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    user3 = Usuario(**user3_data)
    cancion1 = Cancion(**cancion1_data)
    user1.canciones.append(cancion1)
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/cancion-compartida/1", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    response = client.get("/usuario/3/cancion-compartida/1", headers=headers)
    data = response.get_data(as_text=True)

    response_all = client.get("/usuario/3/canciones-compartidas", headers=headers)
    data_all = json.loads(response_all.get_data(as_text=True))

    # Assert
    # Assert
    assert post_response.status_code == 200
    assert post_data["titulo"] == cancion1_data["titulo"]

    assert response.status_code == 403
    assert "Cancion no esta compartido con el usuario" in data

    assert response_all.status_code == 200
    assert len(data_all) == 0


def test_usuario_comparte_cancion_ajena(client):
    # Arrange
    user1 = Usuario(**user1_data)
    user2 = Usuario(**user2_data)
    cancion1 = Cancion(**cancion1_data)
    cancion2 = Cancion(**cancion2_data)
    user1.canciones.append(cancion1)
    user2.canciones.append(cancion2)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    # Act
    post_response = client.post("/usuario/2/cancion-compartida/2", headers=headers)
    post_data = json.loads(post_response.get_data(as_text=True))

    # Assert
    # Assert
    assert post_response.status_code == 405
    assert "Cancion no pertenece al usuario" in post_data


def test_comentar_album(client):
    # Arrange
    user1 = Usuario(**user1_data)
    album1 = Album(**album1_data)
    user1.albumes.append(album1)
    db.session.add(user1)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    contenido = "Comentario"
    # Comentar Album 1 por parte del usuario 1
    response = client.post(
        "/album/1/comentario", headers=headers, json={"contenido": contenido}
    )
    data = json.loads(response.get_data(as_text=True))

    # Assert
    assert response.status_code == 200
    assert data["id"] == 1
    assert data["contenido"] == contenido


def test_comentar_cancion(client):
    # Arrange
    user1 = Usuario(**user1_data)
    cancion1 = Cancion(**cancion1_data)
    user1.canciones.append(cancion1)
    db.session.add(user1)
    db.session.commit()

    token = client.post("/logIn", json=user1_data, follow_redirects=True).json["token"]
    headers = {"Authorization": "Bearer {}".format(token)}

    contenido = "Comentario"
    # Comentar Cancion 1 por parte del usuario 1
    response = client.post(
        "/cancion/1/comentario", headers=headers, json={"contenido": contenido}
    )
    data = json.loads(response.get_data(as_text=True))

    # Assert
    assert response.status_code == 200
    assert data["id"] == 1
    assert data["contenido"] == contenido
