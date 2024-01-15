import jwt from 'jsonwebtoken'

class Jwt {
  public createToken(payload: object, secret: string, exp: object): Promise<string>{
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
}

export default Jwt