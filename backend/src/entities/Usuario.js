export default class Usuario{
    constructor(id, verificadoPrestador, verificadoContratador, nombre, password, mail, telefono, fotoPerfil, fechaNacimiento){
        this.id = id,
        this.verificadoPrestador = verificadoPrestador,
        this.verificadoContratador = verificadoContratador,
        this.nombre = nombre,
        this.password = password, 
        this.mail = mail,
        this.telefono = telefono,
        this.fotoPerfil = fotoPerfil,
        this.fechaNacimiento = fechaNacimiento
    }
}