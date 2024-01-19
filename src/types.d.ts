import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface VerifyTk extends JwtPayload{
  id?: number
}
export interface MyRequest extends Request{
  user?: string | VerifyTk
}