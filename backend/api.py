from flask import Flask
from flask_restful import Api

from backend.vistas.vistas import (
    VistaAlbum,
    VistaAlbumCompartidoUsuario,
    VistaAlbumesCanciones,
    VistaAlbumsCompartidosUsuario,
    VistaAlbumsUsuario,
    VistaCancion,
    VistaCancionCompartidaUsuario,
    VistaCancionesAlbum,
    VistaCancionesCompartidasUsuario,
    VistaCancionesUsuario,
    VistaComentarioAlbum,
    VistaComentarioCancion,
    VistaLogIn,
    VistaSignIn,
    VistaUsuario,
)


def create_api(app: Flask) -> Api:
    api = Api(app)
    api.add_resource(VistaAlbum, "/album/<int:id_album>")
    api.add_resource(
        VistaAlbumCompartidoUsuario,
        "/usuario/<int:id_usuario>/album-compartido/<int:id_album>",
    )
    api.add_resource(VistaAlbumesCanciones, "/cancion/<int:id_cancion>/albumes")
    api.add_resource(
        VistaAlbumsCompartidosUsuario, "/usuario/<int:id_usuario>/albumes-compartidos"
    )
    api.add_resource(VistaAlbumsUsuario, "/usuario/<int:id_usuario>/albumes")
    api.add_resource(VistaCancion, "/cancion/<int:id_cancion>")
    api.add_resource(
        VistaCancionCompartidaUsuario,
        "/usuario/<int:id_usuario>/cancion-compartida/<int:id_cancion>",
    )
    api.add_resource(VistaCancionesAlbum, "/album/<int:id_album>/canciones")
    api.add_resource(
        VistaCancionesCompartidasUsuario,
        "/usuario/<int:id_usuario>/canciones-compartidas",
    )
    api.add_resource(VistaCancionesUsuario, "/usuario/<int:id_usuario>/canciones")
    api.add_resource(VistaComentarioAlbum, "/album/<int:id_album>/comentario")
    api.add_resource(VistaComentarioCancion, "/cancion/<int:id_cancion>/comentario")
    api.add_resource(VistaLogIn, "/logIn")
    api.add_resource(VistaSignIn, "/signin")
    api.add_resource(VistaUsuario, "/usuarios/<int:id_usuario>")

    return api
