import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FornecedorService } from './fornecedores.service';
import { FornecedorController } from './fornecedores.controller';
import { Fornecedor } from './entities/fornecedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fornecedor])],
  controllers: [FornecedorController],
  providers: [FornecedorService],
  exports: [FornecedorService], // Exportado caso precise injetar em outros módulos (como o de notas)
})
export class FornecedorModule {}