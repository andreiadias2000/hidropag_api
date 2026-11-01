import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './entities/usuario.entity';
import { Perfil } from '../perfil/entities/perfil.entity'; // Certifique-se de criar este caminho
import { HashService } from '../common/middlewares/hash.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuarios)
    private readonly repository: Repository<Usuarios>,
    
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,

    private readonly hashService: HashService,
  ) {}

  /**
   * Este método roda automaticamente sempre que o servidor sobe.
   * Ele garante que os perfis existam e que haja um administrador Root.
   */
  
  async onModuleInit() {
    const nomesPerfis = ['root', 'gestor', 'lancador', 'leitor'];
    
    // 1. Garante os perfis
    for (const nome of nomesPerfis) {
      const perfilExiste = await this.perfilRepository.findOne({ where: { nome } });
      if (!perfilExiste) {
        // Usando save(create()) para garantir a tipagem correta
        const novoPerfil = this.perfilRepository.create({ nome });
        await this.perfilRepository.save(novoPerfil);
      }
    }

    // 2. Cria o usuário Root inicial
    
    const emailRoot = process.env.ROOT_EMAIL || 'admin@hidropag.com' ;
    const senhaRoot = process.env.ROOT_SENHA || 'Admin#2026' ;
    const rootExiste = await this.repository.findOne({ where: { email: emailRoot } });

    if (!rootExiste) {
      const perfilRoot = await this.perfilRepository.findOne({ where: { nome: 'root' } });

      // Correção do Erro: Verificamos se o perfil foi encontrado antes de criar o usuário
      if (perfilRoot) {
        const senhaHashed = await this.hashService.gerarHash(senhaRoot!);

        // Forçamos o tipo para DeepPartial para evitar o erro de sobrecarga
        const dadosUsuario = {
          nome: 'Administrador Root',
          email: emailRoot,
          senha: senhaHashed,
          perfil: perfilRoot, // Agora o TS sabe que não é null
        };

        const novoRoot = this.repository.create(dadosUsuario);
        await this.repository.save(novoRoot);
        console.log('🚀 [Seed] Perfis e Usuário ROOT criados com sucesso!');
      } else {
        console.error('❌ Erro: Perfil "root" não encontrado para criar o admin inicial.');
      }
    }
  }
  


  async inserir(dados: CreateUsuarioDto): Promise<Usuarios> {
    if (!dados.email || !dados.senha) {
      throw new BadRequestException("Falta dados obrigatórios");
    }

    const usuarioExistente = await this.repository.findOne({
      where: { email: dados.email }
    });

    if (usuarioExistente) {
      throw new BadRequestException("Este e-mail já está cadastrado no sistema.");
    }

    const senhaCriptografada = await this.hashService.gerarHash(dados.senha);

    const novoUsuarioData: Partial<Usuarios> = {
      nome: dados.nome,
      email: dados.email,
      senha: senhaCriptografada,
      ativo: true,// 🔒 Fixo: todo novo usuário nasce ativo por padrão
      
      perfil: dados.perfil ? ({ id: dados.perfil.id } as any) : undefined,
      filial: dados.filial ? ({ id: dados.filial.id } as any) : undefined,
    };

    const novoUsuario = this.repository.create(novoUsuarioData);

    return await this.repository.save(novoUsuario);
  }

  async listar(): Promise<Usuarios[]> {
    return await this.repository.find({
      relations: ['filial', 'perfil'], // Adicionado perfil na listagem
    });
  }

  async buscarPorId(id: string): Promise<Usuarios> {
    const usuario = await this.repository.findOne({
      where: { id },
      relations: ['filial', 'aprovacoes', 'perfil'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }

  async alterar(id: string, dadosAtualizacao: Partial<Usuarios>): Promise<void> {
  // 1. Verifica se o usuário existe (lança NotFound se não encontrar)
  const usuarioExiste = await this.buscarPorId(id);

  if (!usuarioExiste) {
    throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
  }

  // 2. Se houver nova senha, gera o hash criptografado
  if (dadosAtualizacao.senha) {
    dadosAtualizacao.senha = await this.hashService.gerarHash(dadosAtualizacao.senha);
  } else {
    // Garante que se a senha não foi enviada, ela não seja sobrescrita com vazia/undefined
    delete dadosAtualizacao.senha;
  }

  // 3. Remove o ID de dentro do objeto para evitar conflito na chave primária
  delete dadosAtualizacao.id;

  // 4. Executa o update informando o ID explicitamente
  await this.repository.update(id, dadosAtualizacao);
  }

  async remove(id: string): Promise<void> {
  const usuario = await this.repository.findOne({ where: { id } });
  if (!usuario) {
    throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
  }

  await this.repository.update(id, { ativo: false });
  }
}