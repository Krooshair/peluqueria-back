import jwt, { JwtPayload } from 'jsonwebtoken'

class Jwt {
  public createToken(payload: JwtPayload, secret: string, exp: object = {}): Promise<string>{
    return new Promise((resolve, rejects) => {
      jwt.sign(payload,secret,exp,(err, token) => {
        if(err){
          rejects(err)
        }
        if(token){
          resolve(token)
        }
      })
    })
  }

  public verifyToken(token: string, secret: string): Promise<JwtPayload | string>{
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          if (decoded) {
            resolve(decoded);
          } else {
            reject(new Error('No se pudo decodificar el token'));
          }
        }
      });
    });
  }
}

export default Jwt