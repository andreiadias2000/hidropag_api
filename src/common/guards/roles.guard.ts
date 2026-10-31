// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const usuario = request['user']; 

    if (!usuario) {
      throw new ForbiddenException('Acesso negado: Usuário não identificado na requisição.');
    }

    const nomePerfil = (usuario.perfil?.nome || usuario.perfil)?.toLowerCase();
    const metodoHttp = request.method; 
    const rotaUrl = request.url.toLowerCase(); 

    console.log(`[RolesGuard] Usuário: ${usuario.email} | Perfil: ${nomePerfil} | Método: ${metodoHttp} | Rota: ${rotaUrl}`);

    // 1. ROOT / ADMIN: Acesso total a tudo
    if (nomePerfil === 'root' || nomePerfil === 'admin') {
      return true;
    }

    // 2. LEITOR: Apenas visualização (GET)
    if (nomePerfil === 'leitor') {
      if (metodoHttp !== 'GET') {
        throw new ForbiddenException("Acesso negado: O perfil 'leitor' possui permissão apenas de visualização.");
      }
      return true;
    }

    // 3. LANÇADOR: Pode cadastrar, editar e desativar, MAS NÃO PODE APROVAR
    if (nomePerfil === 'lancador') {
      if (rotaUrl.includes('aprovar') || rotaUrl.includes('aprovacao')) {
        throw new ForbiddenException("Acesso negado: O perfil 'lancador' não tem permissão para realizar aprovações.");
      }
      return true;
    }

    // 4. GESTOR: Faz tudo do lançador e tem acesso total às aprovações
    if (nomePerfil === 'gestor') {
      return true;
    }

    throw new ForbiddenException('Acesso negado: Perfil de usuário inválido ou não reconhecido.');
  }
}