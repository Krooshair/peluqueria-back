import IUser from './IUser'
import Conexion from '../Conexion'
import { RowDataPacket } from 'mysql2'
import bcrypt from 'bcryptjs'

class User {
  private db: Conexion

  constructor() {
    this.db = Conexion.getInstance()
  }

  public async create(data: IUser): Promise<{user: RowDataPacket[], error: string}> {
    let cn
    try {
      await this.db.createConnection()
      cn = this.db.getConecction()
      const sqlCheck = 'SELECT * FROM `usuario` WHERE `correo` = ? OR `usuario` = ?';
      const [checked] = await cn.execute<RowDataPacket[]>(sqlCheck, [data.email, data.username])
      if(checked.length > 0){
        return {user: [], error: 'El correo o el usuario ya estan registrados'}
      }

      const saltPass = await bcrypt.genSalt(10)
      const hashPass = await bcrypt.hash(data.password, saltPass)

      const sqlInsert = 'INSERT INTO `usuario` (`usuario`, `correo`, `nombre`, `apellido`, `clave`, `id_rol`) VALUES (?,?,?,?,?,?)'
      const values = [data.username, data.email, data.name, data.lastname, hashPass, data.id_role]
      await cn.execute<RowDataPacket[]>(sqlInsert, values)

      const sqlSelect = 'SELECT * FROM `usuario` WHERE `id` = LAST_INSERT_ID()';
      const [newUser] = await cn.query<RowDataPacket[]>(sqlSelect);
      return {user: newUser, error: ''}
    } catch (error) {
      console.log('Hubo un error al crear usuario: ', error)
      throw error
    } finally{
      if(cn){
        cn.end((err: Error) => {
          console.log(err)
        })
      }
    }
  }

  public async filterId(id: number): Promise<{user: RowDataPacket[], error: string}>{
    let cn;
    try {
      await this.db.createConnection();
      cn = this.db.getConecction();
      const sql = 'SELECT * FROM `usuario` WHERE id = ?';
      const [results] = await cn.execute<RowDataPacket[]>(sql, [id]);
      if(results.length === 0){
        return {user: [], error: 'El usuario no existe'}
      }
      return {user: results, error: ''}
    } catch (error) {
      console.log('Ocurrio un error al buscar por id: ', error)
      throw error
    } finally{
      if(cn){
        cn.end((err: Error) => {
          console.log(err)
        })
      }
    }
  }

  public async findUser(email: string, password: string): Promise<{user: RowDataPacket[], error: string}>{
    let cn;
    try {
      await this.db.createConnection()
      cn = this.db.getConecction()
      const sql = 'SELECT * FROM `usuario` WHERE `correo` = ?'
      const [results] = await cn.execute<RowDataPacket[]>(sql, [email])
      if(results.length === 0){
        return {user: [], error: 'El correo no existe'}
      }

      const comparePass = await bcrypt.compare(password, results[0].clave)
      if(!comparePass){
        return {user: [], error: 'La clave es incorrecta'}
      }

      return { user: results, error: '' }
    } catch (error) {
      console.log('Hubo un error al comparar credenciales: ', error)
      throw error
    } finally{
      if(cn){
        cn.end((err: Error) => {
          console.log(err)
        })
      }
    }
  }
}

export default User
