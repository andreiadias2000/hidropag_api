// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source'; 

// Importação dos Módulos
import { FiliaisModule } from './filiais/filiais.module';
import { UsuariosModule } from './usuarios/usuarios.module'; 
import { NotasFiscaisModule } from './notas-fiscais/notas-fiscais.module';
import { AprovaçoesModule } from './aprovaçoes/aprovaçoes.module';
import { ObrasEmpreendimentosModule } from './obras-empreendimentos/obras-empreendimentos.module';
import { LoginService } from './usuarios/login.service';
import { TokenMiddleware } from './common/middlewares/token.middleware';
import { PerfisModule } from './perfil/entities/perfil.module'; // Verifique se o caminho é este
import { UsuariosController } from './usuarios/usuarios.controller';
import { NotasFiscaisController } from './notas-fiscais/notas-fiscais.controller';
import { ObrasEmpreendimentosController } from './obras-empreendimentos/obras-empreendimentos.controller';
import { FiliaisController } from './filiais/filiais.controller';
import { AprovaçoesController } from './aprovaçoes/aprovaçoes.controller';
import { PerfisController } from './perfil/entities/perfil.controller';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    FiliaisModule,
    UsuariosModule,
    NotasFiscaisModule,
    AprovaçoesModule,
    ObrasEmpreendimentosModule,
    PerfisModule,
    ClientesModule, // Módulo de Perfis adicionado 
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly loginService: LoginService) {}

  configure(consumer: MiddlewareConsumer) {
    const tokenMiddleware = new TokenMiddleware(this.loginService);

    consumer
      .apply(tokenMiddleware.verificarAcesso)
      .exclude(
        { path: 'usuarios/login', method: RequestMethod.POST },
       
      )
      .forRoutes(
        UsuariosController,
        NotasFiscaisController,
        ObrasEmpreendimentosController,
        FiliaisController,
        PerfisController,
        AprovaçoesController  
      );
  }
}