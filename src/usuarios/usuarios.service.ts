import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Usuarios } from './entities/usuario.entity';
import { Perfil } from '../perfil/entities/perfil.entity';
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

  async onModuleInit() {
    const nomesPerfis = ['root', 'gestor', 'lancador', 'leitor'];
    
    for (const nome of nomesPerfis) {
      const perfilExiste = await this.perfilRepository.findOne({ where: { nome } });
      if (!perfilExiste) {
        const novoPerfil = this.perfilRepository.create({ nome });
        await this.perfilRepository.save(novoPerfil);
      }
    }

    const emailRoot = process.env.ROOT_EMAIL || 'admin@hidropag.com';
    const senhaRoot = process.env.ROOT_SENHA || 'Admin#2026';
    const rootExiste = await this.repository.findOne({ where: { email: emailRoot } });

    if (!rootExiste) {
      const perfilRoot = await this.perfilRepository.findOne({ where: { nome: 'root' } });

      if (perfilRoot) {
        const senhaHashed = await this.hashService.gerarHash(senhaRoot!);

        const dadosUsuario = {
          nome: 'Administrador Root',
          email: emailRoot,
          senha: senhaHashed,
          perfil: perfilRoot,
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
    if (!dados.nome || !dados.email || !dados.senha) {
      throw new BadRequestException('Nome, e-mail e senha são obrigatórios.');
    }

    const perfilId = dados.perfil?.id?.trim();
    if (!perfilId) {
      throw new BadRequestException('É obrigatório selecionar um perfil de acesso válido.');
    }

    const usuarioExistente = await this.repository.findOne({
      where: { email: dados.email },
    });

    if (usuarioExistente) {
      throw new BadRequestException('Este e-mail já está cadastrado no sistema.');
    }

    const perfilSelecionado = await this.perfilRepository.findOne({
      where: { id: perfilId as any },
    });

    if (!perfilSelecionado) {
      throw new NotFoundException('Perfil de acesso não encontrado.');
    }

    // 🔒 Bloqueia criação de novos usuários com perfil 'root'
    if (perfilSelecionado.nome?.toLowerCase() === 'root') {
      throw new ForbiddenException(
        'Por segurança, não é permitido cadastrar novos usuários com o perfil Root.',
      );
    }

    const senhaCriptografada = await this.hashService.gerarHash(dados.senha);

    const novoUsuario = this.repository.create({
      nome: dados.nome,
      email: dados.email,
      senha: senhaCriptografada,
      ativo: true,
      perfil: perfilSelecionado,
      filial: dados.filial?.id ? ({ id: dados.filial.id } as any) : undefined,
    });

    return await this.repository.save(novoUsuario);
  }



  // Oculta o usuário 'root' da listagem geral e remove o campo senha do retorno
  async listar(): Promise<Usuarios[]> {
    const usuarios = await this.repository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.filial', 'filial')
      .leftJoinAndSelect('usuario.perfil', 'perfil')
      .where('LOWER(perfil.nome) != :root OR perfil.id IS NULL', {
        root: 'root',
      })
      .orderBy('usuario.nome', 'ASC')
      .getMany();

    return usuarios.map(({ senha, ...rest }) => rest as Usuarios);
  }

  async buscarPorId(id: string): Promise<Usuarios> {
    const usuario = await this.repository.findOne({
      where: { id },
      relations: ['filial', 'aprovacoes', 'perfil'],
    });

    if (!usuario || usuario.perfil?.nome === 'root') {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const { senha, ...semSenha } = usuario;
    return semSenha as Usuarios;
  }

  async alterar(id: string, dadosAtualizacao: Partial<Usuarios>): Promise<void> {
    await this.buscarPorId(id);

    // 🔒 Valida o perfil informado e impede promover qualquer usuário para 'root'
    if (dadosAtualizacao.perfil?.id) {
      const perfilId = String(dadosAtualizacao.perfil.id).trim();
      const perfilSelecionado = await this.perfilRepository.findOne({
        where: { id: perfilId as any },
      });

      if (!perfilSelecionado) {
        throw new NotFoundException('Perfil de acesso não encontrado.');
      }

      if (perfilSelecionado.nome?.toLowerCase() === 'root') {
        throw new ForbiddenException(
          'Não é permitido atribuir o perfil Root a um usuário.',
        );
      }

      dadosAtualizacao.perfil = perfilSelecionado;
    }

    if (dadosAtualizacao.senha) {
      dadosAtualizacao.senha = await this.hashService.gerarHash(dadosAtualizacao.senha);
    } else {
      delete dadosAtualizacao.senha;
    }

    delete dadosAtualizacao.id;

    await this.repository.update(id, dadosAtualizacao);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.repository.findOne({
      where: { id },
      relations: ['perfil'],
    });

    if (!usuario || usuario.perfil?.nome === 'root') {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    await this.repository.update(id, { ativo: false });
  }
}