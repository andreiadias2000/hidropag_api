// src/aprovaçoes/dto/update-aprovaçoe.dto.ts
import { PartialType } from '@nestjs/swagger'; // 👈 MODIFICADO: Mudei de @nestjs/mapped-types para @nestjs/swagger
import { CreateAprovacoeDto } from './create-aprovacoe.dto';

export class UpdateAprovacoeDto extends PartialType(CreateAprovacoeDto) {}
