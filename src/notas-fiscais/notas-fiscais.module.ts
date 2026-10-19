import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasFiscaisService } from './notas-fiscais.service';
import { NotasFiscaisController } from './notas-fiscais.controller';
import { Notas } from './entities/notas-fiscais.entity';
import { Obras } from '../obras-empreendimentos/entities/obras-empreendimento.entity';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [
    // O segredo está aqui: avisamos o módulo que ele agora acede às Obras também!
    TypeOrmModule.forFeature([Notas, Obras]), 
    NotificacoesModule,
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

