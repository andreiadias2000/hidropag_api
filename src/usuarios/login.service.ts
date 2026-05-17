// src/usuarios/login.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuarios } from "./entities/usuario.entity"; 
import * as jwt from "jsonwebtoken";
import { HashService } from "../common/middlewares/hash.service";

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(Usuarios)
        private readonly repository: Repository<Usuarios>,
        private readonly hashService: HashService // Injete o HashService aqui
    ) {}

    async verificarLogin(email: string, senha: string): Promise<string> {
        const SECRET = process.env.JTW_SENHA;
        
        // CORREÇÃO CRUCIAL: Adicionado 'relations' para o TypeORM trazer o perfil do banco de dados
        const usuario = await this.repository.findOne({ 
            where: { email: email },
            relations: ['perfil'] 
        });

        // 1. Verificamos se o usuário existe E se ele tem uma senha gravada no banco
        if (!usuario || !usuario.senha) {
            throw { id: 401, msg: "Usuario ou senha invalidos" };
        }

        // 2. Agora o TS sabe que 'usuario.senha' é uma string garantida
        const senhaValida = await this.hashService.comparar(senha, usuario.senha);

        if (senhaValida) {
            // CORREÇÃO CRUCIAL: Agora injetamos a estrutura de perfil COMPLETA dentro do payload do JWT
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    nome: usuario.nome,
                    email: usuario.email,
                    perfil: {
                        id: usuario.perfil?.id,
                        nome: usuario.perfil?.nome // Aqui vai a palavra 'leitor' ou 'root'
                    }
                }, 
                SECRET as string, 
                { expiresIn: '1h' }
            );
            return token;
        }

        throw { id: 401, msg: "Usuario ou senha invalidos" };
    }

    async validarToken(token: string): Promise<any> {
        try {
            const SECRET = process.env.JTW_SENHA;
            
            // O jwt.verify decodifica o token e retorna o objeto do usuário completo com o perfil injetado
            const payload = jwt.verify(token, SECRET as string);
            
            return payload; // Retorna os dados para o TokenMiddleware salvar em req['user']
        } catch (err) {
            throw { id: 401, msg: "Token inválido ou expirado" };
        }
    }
}