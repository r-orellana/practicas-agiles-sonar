from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from ..modelos import (
    Album,
    AlbumSchema,
    Cancion,
    CancionSchema,
    ComentarioAlbum,
    ComentarioAlbumSchema,
    ComentarioCancion,
    ComentarioCancionSchema,
    Usuario,
    UsuarioSchema,
    db,
)

comentaCancion_schema = ComentarioCancionSchema()
comentaAlbum_schema = ComentarioAlbumSchema()
cancion_schema = CancionSchema()
usuario_schema = UsuarioSchema()
album_schema = AlbumSchema()


class VistaCancionesUsuario(Resource):
    def post(self, id_usuario):
        nueva_cancion = Cancion(
            titulo=request.json["titulo"],
            minutos=request.json["minutos"],
            segundos=request.json["segundos"],
            interprete=request.json["interprete"],
        )
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.canciones.append(nueva_cancion)

        db.session.commit()
        return cancion_schema.dump(nueva_cancion)

    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        return [cancion_schema.dump(ca) for ca in usuario.canciones]


class VistaCancion(Resource):
    def get(self, id_cancion):
        return cancion_schema.dump(Cancion.query.get_or_404(id_cancion))

    def put(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        cancion.titulo = request.json.get("titulo", cancion.titulo)
        cancion.minutos = request.json.get("minutos", cancion.minutos)
        cancion.segundos = request.json.get("segundos", cancion.segundos)
        cancion.interprete = request.json.get("interprete", cancion.interprete)
        db.session.commit()
        return cancion_schema.dump(cancion)

    def delete(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        db.session.delete(cancion)
        db.session.commit()
        return "", 204


class VistaAlbumesCanciones(Resource):
    def get(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        return [album_schema.dump(al) for al in cancion.albumes]


class VistaSignIn(Resource):
    def post(self):
        nuevo_usuario = Usuario(
            nombre=request.json["nombre"], contrasena=request.json["contrasena"]
        )
        db.session.add(nuevo_usuario)
        db.session.commit()
        token_de_acceso = create_access_token(identity=nuevo_usuario.id)
        return {"mensaje": "usuario creado exitosamente", "token": token_de_acceso}

    def put(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.contrasena = request.json.get("contrasena", usuario.contrasena)
        db.session.commit()
        return usuario_schema.dump(usuario)

    def delete(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        db.session.delete(usuario)
        db.session.commit()
        return "", 204


class VistaLogIn(Resource):
    def post(self):
        usuario = Usuario.query.filter(
            Usuario.nombre == request.json["nombre"],
            Usuario.contrasena == request.json["contrasena"],
        ).first()
        db.session.commit()
        if usuario is None:
            return "El usuario no existe", 404
        else:
            token_de_acceso = create_access_token(identity=usuario.id)
            return {"mensaje": "Inicio de sesión exitoso", "token": token_de_acceso}


class VistaAlbumsUsuario(Resource):
    @jwt_required()
    def post(self, id_usuario):
        nuevo_album = Album(
            titulo=request.json["titulo"],
            anio=request.json["anio"],
            descripcion=request.json["descripcion"],
            medio=request.json["medio"],
        )
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.albumes.append(nuevo_album)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return "El usuario ya tiene un album con dicho nombre", 409

        return album_schema.dump(nuevo_album)

    @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        return [album_schema.dump(al) for al in usuario.albumes]


class VistaCancionesAlbum(Resource):
    def post(self, id_album):
        album = Album.query.get_or_404(id_album)

        if "id_cancion" in request.json.keys():

            nueva_cancion = Cancion.query.get(request.json["id_cancion"])
            if nueva_cancion is not None:
                album.canciones.append(nueva_cancion)
                db.session.commit()
            else:
                return "Canción errónea", 404
        else:
            nueva_cancion = Cancion(
                titulo=request.json["titulo"],
                minutos=request.json["minutos"],
                segundos=request.json["segundos"],
                interprete=request.json["interprete"],
            )
            album.canciones.append(nueva_cancion)
        db.session.commit()
        return cancion_schema.dump(nueva_cancion)

    def get(self, id_album):
        album = Album.query.get_or_404(id_album)
        return [cancion_schema.dump(ca) for ca in album.canciones]


class VistaAlbum(Resource):
    def get(self, id_album):
        return album_schema.dump(Album.query.get_or_404(id_album))

    def put(self, id_album):
        album = Album.query.get_or_404(id_album)
        album.titulo = request.json.get("titulo", album.titulo)
        album.anio = request.json.get("anio", album.anio)
        album.descripcion = request.json.get("descripcion", album.descripcion)
        album.medio = request.json.get("medio", album.medio)
        db.session.commit()
        return album_schema.dump(album)

    def delete(self, id_album):
        album = Album.query.get_or_404(id_album)
        db.session.delete(album)
        db.session.commit()
        return "", 204


class VistaUsuario(Resource):
    def get(self, id_usuario):
        listUsuariosSimple = []
        listUsuarios = Usuario.query.all()

        for u in listUsuarios:
            if u.id != id_usuario:
                usuario = {"nombre": u.nombre, "id": u.id}
                listUsuariosSimple.append(usuario)

        return listUsuariosSimple


class VistaAlbumsCompartidosUsuario(Resource):
    @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        return [album_schema.dump(al) for al in usuario.albumes_compartidos]


class VistaAlbumCompartidoUsuario(Resource):
    @jwt_required()
    def post(self, id_usuario, id_album):
        id_propietario = get_jwt_identity()
        propietario = Usuario.query.get_or_404(id_propietario)
        albumes = propietario.albumes
        if not any([id_album == album.id for album in albumes]):
            return "Album no pertenece al usuario", 405
        album = Album.query.get_or_404(id_album)
        receptor = Usuario.query.get_or_404(id_usuario)
        receptor.albumes_compartidos.append(album)
        db.session.commit()
        return album_schema.dump(album)

    @jwt_required()
    def get(self, id_usuario, id_album):
        usuario = Usuario.query.get_or_404(id_usuario)
        albumes = usuario.albumes_compartidos
        if not any([id_album == album.id for album in albumes]):
            return "Album no esta compartido con el usuario", 403
        album = Album.query.get_or_404(id_album)
        return album_schema.dump(album)


class VistaCancionesCompartidasUsuario(Resource):
    @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        return [cancion_schema.dump(al) for al in usuario.canciones_compartidas]


class VistaCancionCompartidaUsuario(Resource):
    @jwt_required()
    def post(self, id_usuario, id_cancion):
        id_propietario = get_jwt_identity()
        propietario = Usuario.query.get_or_404(id_propietario)
        canciones = propietario.canciones
        if not any([id_cancion == cancion.id for cancion in canciones]):
            return "Cancion no pertenece al usuario", 405
        cancion = Cancion.query.get_or_404(id_cancion)
        receptor = Usuario.query.get_or_404(id_usuario)
        receptor.canciones_compartidas.append(cancion)
        db.session.commit()
        return album_schema.dump(cancion)

    @jwt_required()
    def get(self, id_usuario, id_cancion):
        usuario = Usuario.query.get_or_404(id_usuario)
        canciones = usuario.canciones_compartidas
        if not any([id_cancion == cancion.id for cancion in canciones]):
            return "Cancion no esta compartido con el usuario", 403
        cancion = Cancion.query.get_or_404(id_cancion)
        return cancion_schema.dump(cancion)


# Util functions for getting comment
def get_response(comentario, schema_dump):
    squema = schema_dump.dump(comentario)
    squema["children"] = get_children_list(comentario.children, schema_dump)
    squema["usuario"] = usuario_schema.dump(comentario.usuario)
    return squema


def get_children_list(children, schema_dump):
    children_list = []
    for child in sorted(children, key=lambda x: x.id):
        squema = schema_dump.dump(child)
        squema["usuario"] = usuario_schema.dump(child.usuario)
        children_list += [squema] + get_children_list(child.children, schema_dump)
    return children_list


class VistaComentario(Resource):
    Model = None
    ComentarioModel = None
    comentario_schema = None

    @jwt_required()
    def post(self, id):
        id_usuario = get_jwt_identity()
        propietario = Usuario.query.get_or_404(
            id_usuario,
        )

        obra = self.Model.query.get_or_404(
            id,
        )

        nuevo_comentario = self.ComentarioModel(
            usuarioId=propietario.id,
            obraId=id,
            contenido=request.json.get("contenido"),
        )

        obra.comentarios.append(nuevo_comentario)

        parent_id = request.json.get("parent")

        if parent_id:
            parent = self.ComentarioModel.query.get_or_404(parent_id)
            parent.children.append(nuevo_comentario)

        db.session.commit()
        return self.comentario_schema.dump(nuevo_comentario)

    @jwt_required()
    def get(self, id):
        obra = self.Model.query.get_or_404(id)

        first_level = self.ComentarioModel.query.filter(
            self.ComentarioModel.obra == obra,
            self.ComentarioModel.parent == None,  # Noqa: E711
        ).all()
        return [
            get_response(comentario, self.comentario_schema)
            for comentario in first_level
        ]


class VistaComentarioAlbum(VistaComentario):
    Model = Album
    ComentarioModel = ComentarioAlbum
    comentario_schema = comentaAlbum_schema


class VistaComentarioCancion(VistaComentario):

    Model = Cancion
    ComentarioModel = ComentarioCancion
    comentario_schema = comentaCancion_schema
