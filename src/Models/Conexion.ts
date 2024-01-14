import mysql from 'mysql2/promise'

class Conexion {
  private static instance: Conexion
  private connection: mysql.Connection | null = null

  private constructor() {}

  public static getInstance(): Conexion {
    if (!Conexion.instance) {
      Conexion.instance = new Conexion()
    }
    return Conexion.instance
  }

  public getConecction(): mysql.Connection {
    if (!this.connection) {
      throw Error('No se ha creado una conexion. Primero debe llamar a su metodo createConnection()')
    }
    return this.connection
  }

  public async createConnection(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'peluqueria',
    })
  }
}

export default Conexion
