from flask import Flask
from flask_restful import Api
from .vistas import (
    VistaCancionesUsuario,
    VistaCancion,
    VistaSignIn,
    VistaAlbum,
    VistaAlbumsUsuario,
    VistaCancionesAlbum,
    VistaLogIn,
    VistaAlbumesCanciones,
)


def create_api(app: Flask) -> Api:
    api = Api(app)
    api.add_resource(VistaCancionesUsuario, "/usuario/<int:id_usuario>/canciones")
    api.add_resource(VistaCancion, "/cancion/<int:id_cancion>")
    api.add_resource(VistaAlbumesCanciones, "/cancion/<int:id_cancion>/albumes")
    api.add_resource(VistaSignIn, "/signin")
    api.add_resource(VistaLogIn, "/logIn")
    api.add_resource(VistaAlbumsUsuario, "/usuario/<int:id_usuario>/albumes")
    api.add_resource(VistaAlbum, "/album/<int:id_album>")
    api.add_resource(VistaCancionesAlbum, "/album/<int:id_album>/canciones")
    return api
