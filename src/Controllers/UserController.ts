import { NextFunction, Request, Response } from "express"
import { MyRequest, VerifyTk } from "../types";
import User from "../Models/User/User"
import IUser from "../Models/User/IUser"
import Jwt from "../Library/Jwt";

class UserController {

  private user: User;
  private jwt: Jwt;

  constructor() {
    this.user = new User();
    this.jwt = new Jwt()
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.verify = this.verify.bind(this);
    this.profile = this.profile.bind(this);
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
      const {email, password, isRemember} = req.body
      const execute = await this.user.findUser(email, password)
      if(execute.error){
        return res.status(404).send(execute.error)
      }

      const user = execute.user[0]
      let tk: string;

      if(isRemember){
        tk = await this.jwt.createToken({id: execute.user[0].id},'SECRET',{expiresIn: '7d'})
        res.cookie('token', tk, { maxAge: 7 * 24 * 60 * 60 * 1000 })
      }else{
        tk = await this.jwt.createToken({id: execute.user[0].id},'SECRET', {expiresIn: '1d'})
        res.cookie('token', tk)
      }

      res.json({
        username: user.usuario,
        email: user.correo,
        name: user.nombre,
        lastname: user.apellido,
        id_role: user.id_rol
      })
    } catch (error) {
      console.log('Hubo un error al iniciar sesion: ', error)
      res.status(400).send(error)
    }
  }

  public async logout(req: Request, res: Response){
    try {
      const cookies = req.cookies
      if(!cookies.token){
        return res.status(400).send('No se encontro ninguna sesion abierta')
      }
      res.cookie('token', '', {
        expires: new Date(0)
      })
      res.send('Sesion cerrada')
    } catch (error) {
      console.log('Hubo un error al cerrar sesion: ', error)
      res.status(400).send(error)
    }
  }

  public async verify(req: MyRequest, res: Response, next: NextFunction){
    try{
      const {token} = req.cookies
      if(!token){
        return res.status(400).send('El token no existe')
      }
      const decoded = await this.jwt.verifyToken(token, 'SECRET')
      req.user = decoded
      next()
    }catch(error){
      console.log(error)
      res.status(400).send(error)
    }
  }

  public async profile(req: MyRequest, res: Response) {
    try {
      if(typeof req.user === 'object' && req.user !== null){
        const {id}: VerifyTk = req.user
        if(!id){
          return res.status(400).send('No se encontro el identificador del usuario')
        }
        const execute = await this.user.filterId(id)
        const user = execute.user[0]
        res.json({
          username: user.usuario,
          email: user.correo,
          name: user.nombre,
          lastname: user.apellido,
          id_role: user.id_rol
        })
      }
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}

export default UserController