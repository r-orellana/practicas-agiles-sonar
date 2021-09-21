import { Usuario } from "../usuario/usuario";

export class ComentarioAlbum {
    id: string;
    album: number;
    usuario: Usuario;
    parent: number;
    children: Array<ComentarioAlbum>;
    contenido: string;

    constructor(
        id: string,
        album: number,
        usuario: Usuario,
        parent: number,
        children: Array<ComentarioAlbum>,
        contenido: string
    ) {
        this.id = id,
        this.album = album,
        this.usuario = usuario,
        this.parent = parent,
        this.children = children,
        this.contenido = contenido
    }
}

export class ComentarioCancion {
    id: string;
    cancion: number;
    usuario: Usuario;
    parent: number;
    children: Array<ComentarioCancion>;
    contenido: string;

    constructor(
        id: string,
        cancion: number,
        usuario: Usuario,
        parent: number,
        children: Array<ComentarioCancion>,
        contenido: string
    ) {
        this.id = id,
        this.cancion = cancion,
        this.usuario = usuario,
        this.parent = parent,
        this.children = children,
        this.contenido = contenido
    }
}