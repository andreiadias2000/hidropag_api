<<<<<<< HEAD
=======
// src/clientes/clientes.module.ts

>>>>>>> e49fe5edc4608c096fb9a3c1f817cdcffb300d1d
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';

@Module({
<<<<<<< HEAD
  // Isto ensina ao NestJS o que é a entidade Cliente
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService],
=======
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
>>>>>>> e49fe5edc4608c096fb9a3c1f817cdcffb300d1d
})
export class ClientesModule {}