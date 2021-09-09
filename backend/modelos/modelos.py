from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
import enum


db = SQLAlchemy()

albumes_canciones = db.Table(
    "album_cancion",
    db.Column("album_id", db.Integer, db.ForeignKey("album.id"), primary_key=True),
    db.Column("cancion_id", db.Integer, db.ForeignKey("cancion.id"), primary_key=True),
)

albumes_compartidos = db.Table(
    "album_compartido",
    db.Column("album_id", db.Integer, db.ForeignKey("album.id"), primary_key=True),
    db.Column("usuario_id", db.Integer, db.ForeignKey("usuario.id"), primary_key=True),
)

canciones_compartidas = db.Table(
    "cancion_compartida",
    db.Column("cancion_id", db.Integer, db.ForeignKey("cancion.id"), primary_key=True),
    db.Column("usuario_id", db.Integer, db.ForeignKey("usuario.id"), primary_key=True),
)


class Cancion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(128))
    minutos = db.Column(db.Integer)
    segundos = db.Column(db.Integer)
    interprete = db.Column(db.String(128))
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    albumes = db.relationship(
        "Album", secondary="album_cancion", back_populates="canciones"
    )
    usuarios_compartidos = db.relationship(
        "Usuario",
        secondary="cancion_compartida",
        back_populates="canciones_compartidas",
    )


class Medio(enum.Enum):
    DISCO = 1
    CASETE = 2
    CD = 3


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(128))
    anio = db.Column(db.Integer)
    descripcion = db.Column(db.String(512))
    medio = db.Column(db.Enum(Medio))
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    canciones = db.relationship(
        "Cancion", secondary="album_cancion", back_populates="albumes"
    )
    usuarios_compartidos = db.relationship(
        "Usuario", secondary="album_compartido", back_populates="albumes_compartidos"
    )


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    contrasena = db.Column(db.String(50))
    albumes = db.relationship("Album", cascade="all, delete, delete-orphan")
    canciones = db.relationship("Cancion", cascade="all, delete, delete-orphan")
    albumes_compartidos = db.relationship(
        "Album", secondary="album_compartido", back_populates="usuarios_compartidos"
    )
    canciones_compartidas = db.relationship(
        "Cancion", secondary="cancion_compartida", back_populates="usuarios_compartidos"
    )


class EnumADiccionario(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return {"llave": value.name, "valor": value.value}


class CancionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Cancion
        include_relationships = True
        load_instance = True


class AlbumSchema(SQLAlchemyAutoSchema):
    medio = EnumADiccionario(attribute=("medio"))

    class Meta:
        model = Album
        include_relationships = True
        load_instance = True


class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        include_relationships = True
        load_instance = True
