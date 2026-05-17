// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const usuario = request['user']; 

    // Se o middleware não injetou o usuário por algum motivo, bloqueia por segurança
    if (!usuario) {
      throw new ForbiddenException('Acesso negado: Usuário não identificado na requisição.');
    }

    // Busca o nome do perfil (lidando se ele vier como objeto completo ou string direta)
    const nomePerfil = usuario.perfil?.nome || usuario.perfil;
    const metodoHttp = request.method; 

    // REGRA EXCLUSIVA: Só barra se for 'leitor' e tentar algo diferente de GET
    if (nomePerfil === 'leitor' && metodoHttp !== 'GET') {
      throw new ForbiddenException(`Acesso negado: O perfil 'leitor' possui permissão apenas de visualização (GET).`);
    }

    // Se for root, admin, ou se for uma requisição GET feita pelo leitor, o acesso é liberado!
    return true;
  }
}