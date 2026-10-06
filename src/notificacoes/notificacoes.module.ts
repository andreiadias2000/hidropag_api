import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';

@Module({
  providers: [NotificacoesService],
  exports: [NotificacoesService], // Adicione esta linha!
})
export class NotificacoesModule {}