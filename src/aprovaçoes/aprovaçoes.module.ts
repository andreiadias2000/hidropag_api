// src/aprovaçoes/aprovaçoes.module.ts


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APROVACOES } from './entities/aprovaçoe.entity';
import { Notas } from '../notas-fiscais/entities/notas-fiscais.entity';
import { Obras } from '../obras-empreendimentos/entities/obras-empreendimento.entity';
import { AprovaçoesService } from './aprovaçoes.service';
import { AprovaçoesController } from './aprovaçoes.controller';

@Module({
  // TEM de incluir a Notas e a Obras aqui dentro:
  imports: [TypeOrmModule.forFeature([APROVACOES, Notas, Obras])],
  controllers: [AprovaçoesController],
  providers: [AprovaçoesService],
})
export class AprovaçoesModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AprovaçoesService } from './aprovaçoes.service';
// import { AprovaçoesController } from './aprovaçoes.controller';
// import { APROVACOES } from './entities/aprovaçoe.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([APROVACOES])],
//   controllers: [AprovaçoesController],
//   providers: [AprovaçoesService],
// })
// export class AprovaçoesModule {}



//****************//

// import { Module } from '@nestjs/common';
// import { AprovaçoesService } from './aprovaçoes.service';
// import { AprovaçoesController } from './aprovaçoes.controller';

// @Module({
//   controllers: [AprovaçoesController],
//   providers: [AprovaçoesService],
// })
// export class AprovaçoesModule {}


