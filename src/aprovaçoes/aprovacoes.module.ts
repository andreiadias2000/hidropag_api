import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AprovacoesService } from './aprovacoes.service';
import { AprovaçoesController } from './aprovacoes.controller';
import { APROVACOES } from './entities/aprovacoe.entity';
import { Notas } from '../notas-fiscais/entities/notas-fiscais.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      APROVACOES,
      Notas, // 👈 REGISTRE O REPOSITÓRIO DA NOTA AQUI!
    ]),
  ],
  controllers: [AprovaçoesController],
  providers: [AprovacoesService],
  exports: [AprovacoesService],
})
export class AprovacoesModule {}