import { Usuario } from "../usuario/usuario";


export class Comentario {
    id: string;
    obra: number;
    usuario: Usuario;
    parent: number;
    children: Array<Comentario>;
    contenido: string;

    constructor(
        id: string,
        obra: number,
        usuario: Usuario,
        parent: number,
        children: Array<Comentario>,
        contenido: string
    ) {
        this.id = id;
        this.obra = obra;
        this.usuario = usuario;
        this.parent = parent;
        this.children = children;
        this.contenido = contenido;
    }
}
