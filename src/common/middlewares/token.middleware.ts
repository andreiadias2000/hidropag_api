// src/common/middlewares/token.middleware.ts
import { NextFunction, Request, Response } from "express";
import { LoginService } from "../../usuarios/login.service";

export class TokenMiddleware {
    constructor (private service: LoginService) {}

    verificarAcesso = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.get("Authorization");

        if (authHeader) {
            try {
                const partes = authHeader.split(' ');
                
                if (partes.length !== 2) {
                    return res.status(401).json({ erro: "Formato do token inválido" });
                }

                const tokenLimpo = partes[1];

                // Captura o objeto decodificado retornado pelo método atualizado
                const usuarioDecodificado = await this.service.validarToken(tokenLimpo);
                
                // Injeta o usuário com o perfil dentro da requisição atual
                req['user'] = usuarioDecodificado; 

                next();
            }
            catch (err: any) {
                res.status(401).json({ erro: "Token inválido ou expirado" });
            }
        } 
        else {
            res.status(401).json({ erro: "Nenhum Token informado!" });    
        }       
    }
}