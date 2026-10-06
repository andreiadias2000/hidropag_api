import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasFiscaisService } from './notas-fiscais.service';
import { NotasFiscaisController } from './notas-fiscais.controller';
import { Notas } from './entities/notas-fiscais.entity';
import { NotificacoesModule } from '../notificacoes/notificacoes.module'; // Importação que faltava

@Module({
  imports: [
    TypeOrmModule.forFeature([Notas]), // Corrigido para corresponder à linha 6
    NotificacoesModule // Adicionado aqui
  ],
  controllers: [NotasFiscaisController],
  providers: [NotasFiscaisService],
})
export class NotasFiscaisModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { NotasFiscaisService } from './notas-fiscais.service';
// import { NotasFiscaisController } from './notas-fiscais.controller';
// import { Notas } from './entities/notas-fiscais.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Notas])], // Registro essencial
//   controllers: [NotasFiscaisController],
//   providers: [NotasFiscaisService],
// })
// export class NotasFiscaisModule {}


// import { Module } from '@nestjs/common';
// import { NotasFiscaisService } from './notas-fiscais.service';
// import { NotasFiscaisController } from './notas-fiscais.controller';

// @Module({
//   controllers: [NotasFiscaisController],
//   providers: [NotasFiscaisService],
// })
// export class NotasFiscaisModule {}

// src/notas-fiscais/notas-fiscais.module.ts

