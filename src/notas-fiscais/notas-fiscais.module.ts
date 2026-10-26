// src/notas-fiscais/notas-fiscais.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasFiscaisService } from './notas-fiscais.service';
import { NotasFiscaisController } from './notas-fiscais.controller';
import { Notas } from './entities/notas-fiscais.entity';
import { Fornecedor } from '../fornecedores/entities/fornecedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notas, Fornecedor])], // Registra ambas as entidades
  controllers: [NotasFiscaisController],
  providers: [NotasFiscaisService],
})
export class NotasFiscaisModule {}