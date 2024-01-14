import { Request, Response } from "express"
import User from "../Models/User/User"
import IUser from "../Models/User/IUser"

class UserController {

  private user: User;

  constructor() {
    this.user = new User();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  public async register(req: Request, res: Response){
    try {
      const data: IUser = req.body
      const execute = await this.user.create(data)
      if(execute.error){
        return res.status(400).send(execute.error)
      }
      const user = execute.user[0]
      res.json({
        username: user.usuario,
        email: user.correo,
        nombre: user.nombre,
        apellido: user.apellido,
        id_role: user.id_rol
      })
    } catch (error) {
      console.log('Hubo un error al registrarse: ', error)
      res.status(400).send(error)
    }
  }

  public async login(req: Request, res: Response){
    try {
      const {email, password} = req.body
      const execute = await this.user.findUser(email, password)
      if(execute.error){
        return res.status(404).send(execute.error)
      }
      const user = execute.user[0]
      res.json({
        username: user.usuario,
        email: user.correo,
        nombre: user.nombre,
        apellido: user.apellido,
        id_role: user.id_rol
      })
    } catch (error) {
      console.log('Hubo un error al iniciar sesion: ', error)
      res.status(400).send(error)
    }
  }
}

export default UserController