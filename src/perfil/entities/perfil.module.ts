// src/perfil/perfis.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfisService } from './perfil.service';
import { Perfil } from './perfil.entity'; 
import { PerfisController } from './perfil.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil])],
  controllers: [PerfisController],
  providers: [PerfisService],
  exports: [PerfisService, TypeOrmModule], // Exporta para o UsuariosService poder usar
})
export class PerfilModule {}