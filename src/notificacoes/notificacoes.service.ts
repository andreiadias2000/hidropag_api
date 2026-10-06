import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificacoesService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async notificarNovaNota(emailDestino: string, fornecedor: string, valor: number) {
    const mensagem = `Olá! Uma nova nota fiscal do fornecedor ${fornecedor} no valor de R$ ${valor} aguarda a sua aprovação no sistema Hidropag.`;

    if (emailDestino) {
      try {
        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || '"Sistema Hidropag" <nao-responda@hidropag.com.br>',
          to: emailDestino,
          subject: 'Nova Nota Fiscal para Aprovação',
          text: mensagem,
        });
        console.log(`✉️ E-mail enviado com sucesso para ${emailDestino}`);
      } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
      }
    }
  }
}