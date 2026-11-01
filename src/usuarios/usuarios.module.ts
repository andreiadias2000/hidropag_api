import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from './entities/usuario.entity';
import { Perfil } from '../perfil/entities/perfil.entity'; // Entidade de Perfil
import { PerfilModule } from '../perfil/entities/perfil.module'; // Módulo de Perfis
import { HashService } from '../common/middlewares/hash.service';
import { LoginService } from './login.service';

@Module({
  imports: [
    // Registra as entidades usadas neste módulo
    TypeOrmModule.forFeature([Usuarios, Perfil]), 
    // Importa o PerfisModule para compartilhar o PerfilRepository
    PerfilModule 
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, HashService, LoginService],
  exports: [UsuariosService, LoginService],
})
export class UsuariosModule {}