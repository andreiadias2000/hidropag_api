import { PartialType } from '@nestjs/mapped-types'; // ou '@nestjs/swagger' dependendo do seu projeto
import { CreateClienteDto } from './create-cliente.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt?: Date | null; // 👈 Adicione o "| null" aqui
}