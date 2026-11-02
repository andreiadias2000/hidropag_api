// update-filiais.dto.ts
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateFilialDto } from './create-filiais.dto';
import { IsOptional } from 'class-validator';

export class UpdateFilialDto extends PartialType(CreateFilialDto) {
  @ApiPropertyOptional({ example: null, description: 'Data de desativação (null para reativar, ou data para desativar)' })
  @IsOptional()
  deletedAt?: Date | null;
}
