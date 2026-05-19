// src/aprovaçoes/dto/update-aprovaçoe.dto.ts
import { PartialType } from '@nestjs/swagger'; // 👈 MODIFICADO: Mudei de @nestjs/mapped-types para @nestjs/swagger
import { CreateAprovaçoeDto } from './create-aprovaçoe.dto';

export class UpdateAprovaçoeDto extends PartialType(CreateAprovaçoeDto) {}
