// src/usuarios/usuarios.controller.ts

import { 
  Controller, Get, Post, Delete, Body, Put, Param, Res, HttpStatus, UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from './entities/usuario.entity';
import { LoginService } from './login.service';
import * as express from 'express';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@ApiTags('usuarios')
@ApiBearerAuth('token-acesso')
@Controller('usuarios')
export class UsuariosController {
  
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly loginService: LoginService 
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Realizar login do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@hidropag.com' },
        senha: { type: 'string', example: 'Admin#2026' }
      },
      required: ['email', 'senha']
    }
  })
  async login(@Body() body: any, @Res() res: express.Response) {
    try {
      const { email, senha } = body;
      const token = await this.loginService.verificarLogin(email, senha);
      
      return res.status(HttpStatus.OK).json({
        auth: true,
        token: token
      });
    } catch (err: any) {
      if (err.id && err.msg) {
        return res.status(err.id).json({ erro: err.msg });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        erro: err.message || 'Erro interno no servidor'
      });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @UseGuards(RolesGuard)
  async criar(@Body() usuario: CreateUsuarioDto): Promise<Usuarios> {
    return await this.usuariosService.inserir(usuario as any);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários (Requer Token)' })
  @UseGuards(RolesGuard)
  async buscarTodos(): Promise<Usuarios[]> {
    return await this.usuariosService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID (Requer Token)' })
  @UseGuards(RolesGuard)
  async buscarUm(@Param('id', ParseIntPipe) id: number): Promise<Usuarios> {
    return await this.usuariosService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário (Requer Token)' })
  @UseGuards(RolesGuard)
  @ApiBody({
    description: 'Campos para atualização do usuário (Envie apenas o que deseja alterar)',
    schema: {
      type: 'object',
      example: {
        nome: 'Ivan Silva',
        email: 'ivan@teste.com',
        senha: 'Admin#2026',
        perfil: {
          id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c'
        }
      }
    }
  })
  async atualizar(@Param('id', ParseIntPipe) id: number, @Body() usuario: any): Promise<void> {
    await this.usuariosService.alterar(id, usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário (Requer Token)' })
  @UseGuards(RolesGuard)
  async deletar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.usuariosService.remove(id);
  }
}



// import { Controller, Get, Post, Delete, Body, Put, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
// import { UsuariosService } from './usuarios.service';
// import { Usuarios } from './entities/usuario.entity';
// import { LoginService } from './login.service';
// import * as express from 'express';
// // Adicione o ApiBearerAuth na importação abaixo:
// import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// import { RolesGuard } from '../common/guards/roles.guard';
// import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// @ApiTags('usuarios') // Organiza no Swagger sob a aba 'usuarios'
// @ApiBearerAuth('token-acesso') // <--- ISSO ativa o cadeado no Swagger para este controller
// @Controller('usuarios')

// export class UsuariosController {
  
//   constructor(
//     private readonly usuariosService: UsuariosService,
//     private readonly loginService: LoginService 
//   ) {}

//   @Post('login')
//   @ApiOperation({ summary: 'Realizar login do usuário' })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         email: { type: 'string', example: 'admin@hidropag.com' },
//         senha: { type: 'string', example: 'Admin#2026' }
//       },
//       required: ['email', 'senha']
//     }
//   })
//   async login(@Body() body: any, @Res() res: express.Response) {
//     try {
//       const { email, senha } = body;
//       const token = await this.loginService.verificarLogin(email, senha);
      
//       return res.status(HttpStatus.OK).json({
//         auth: true,
//         token: token
//       });
//     } catch (err: any) {
//       if (err.id && err.msg) {
//         return res.status(err.id).json({ erro: err.msg });
//       }
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         erro: err.message || 'Erro interno no servidor'
//       });
//     }
//   }

//   @Post()
//   @ApiOperation({ summary: 'Criar novo usuário' })
//   @UseGuards(RolesGuard) // Seu guardião que bloqueia o leitor
//   async criar(@Body() usuario: CreateUsuarioDto): Promise<Usuarios> {
//     return await this.usuariosService.inserir(usuario as any);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Listar todos os usuários (Requer Token)' })
//   async buscarTodos(): Promise<Usuarios[]> {
//     return await this.usuariosService.listar();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Buscar usuário por ID (Requer Token)' })
//   async buscarUm(@Param('id') id: number): Promise<Usuarios> {
//     return await this.usuariosService.buscarPorId(id);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Atualizar usuário (Requer Token)' })
//   @UseGuards(RolesGuard) // Seu guardião que bloqueia o leitor
//   @ApiBody({
//     description: 'Campos para atualização do usuário (Envie apenas o que deseja alterar)',
//     schema: {
//       type: 'object',
//       example: {
//         nome: 'Ivan Silva',// depois adicionar a variavel do .env
//         email: 'ivan@teste.com',
//         senha: 'Admin#2026',
//         perfil: {
//           id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c'
//         }
//       }
//     }
//   })
//   async atualizar(@Param('id') id: number, @Body() usuario: any): Promise<void> {
//     await this.usuariosService.alterar(id, usuario);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Excluir usuário (Requer Token)' })
//   async deletar(@Param('id') id: string): Promise<void> {
//     return await this.usuariosService.remove(Number(id));
//   }
// }