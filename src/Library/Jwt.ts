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

  public verifyToken(token: string, secret: string): JwtPayload | string{
    const decoded = jwt.verify(token, secret)
    return decoded
  }
}

export default Jwt