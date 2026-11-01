import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmTestConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'hidropag_test',
  // O Postgres aceita enums perfeitamente, então podemos carregar todas as entidades
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
  logging: false,
};
//1
//docker start hidropag-test-db
//2
//npx jest --config ./test/jest-e2e.json test/clientes.e2e-spec.ts --detectOpenHandles








// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import * as path from 'path';
// import { Cliente } from '../../src/clientes/entities/cliente.entity';
// import { Usuarios } from '../../src/usuarios/entities/usuario.entity';
// import { Perfil } from '../../src/perfil/entities/perfil.entity';
// import { Filiais } from '../../src/filiais/entities/filiais.entity';
// import { Notas } from '../../src/notas-fiscais/entities/notas-fiscais.entity';
// import { Fornecedor } from '../../src/fornecedores/entities/fornecedor.entity';
// import { Obras } from '../../src/obras-empreendimentos/entities/obras-empreendimento.entity';
// import { APROVACOES } from '../../src/aprovaçoes/entities/aprovacoe.entity';

// export const typeOrmTestConfig: TypeOrmModuleOptions = {
//   type: 'sqlite',
//   database: path.join(__dirname, 'database-test.sqlite'),
//   // Padrão glob que pega absolutamente TODAS as entidades do seu NestJS
//   entities: [Cliente, Usuarios, Perfil,Filiais,Perfil,Notas,Obras,APROVACOES,Fornecedor],//[__dirname + './../../src/**/*.entity{.ts,.js}'],
//   synchronize: true,     // Cria todas as tabelas e relações automaticamente
//   dropSchema: true,      // Limpa tudo ao reiniciar os testes
//   logging: false,
//   // 🛠️ Truque do TypeORM para SQLite aceitar colunas ENUM do Postgres sem quebrar
//   entitySkipConstructor: true,
//   extra: {
//     // Força o SQLite a aceitar mapeamentos estendidos se necessário        // Deixa o terminal limpo (mude para true se quiser ver os SQLs rodando)
//   },  
// };