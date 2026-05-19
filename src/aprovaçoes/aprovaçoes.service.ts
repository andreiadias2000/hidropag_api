import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { APROVACOES } from './entities/aprovaçoe.entity';
import { CreateAprovaçoeDto } from './dto/create-aprovaçoe.dto';

@Injectable()
export class AprovaçoesService {
  constructor(
    @InjectRepository(APROVACOES)
    private readonly repository: Repository<APROVACOES>,
  ) {}

  // Salva uma nova decisão (Aprovar/Reprovar)
  async inserir(dto: CreateAprovaçoeDto): Promise<APROVACOES> {
    // 1. Verifica se já existe alguma aprovação cadastrada para o ID desta nota
    const aprovacaoExistente = await this.repository.findOne({
      where: { nota: { id: dto.nota } }
    });

    // 2. Se já existir, bloqueia a criação e retorna um erro 409
    if (aprovacaoExistente) {
      throw new ConflictException(`A nota fiscal com ID ${dto.nota} já foi avaliada e possui uma aprovação registrada.`);
    }

    // 3. Se não existir, prossegue com a criação normalmente
    const novaAprovacao = this.repository.create({
      decisao: dto.decisao,
      observacao: dto.observacao,
      nota: { id: dto.nota },
      usuario: { id: dto.usuario }
    });

    return await this.repository.save(novaAprovacao);
  }

  // 1. LISTAR COM FILTRO DE COLUNAS (Evita travar o Swagger)
  async listar(): Promise<APROVACOES[]> {
    return await this.repository.find({
      relations: ['usuario', 'nota'],
      select: {
        id: true,
        decisao: true,
        observacao: true,
        decidido_em: true,
        // 👇 Filtra as colunas da Nota Relacionada (Deixando o PDF de fora)
        nota: {
          id: true,
          numero_nf: true,
          fornecedor: true,
          valor_total: true,
          status: true,
          tem_anexo: true, 
        },
        // 👇 Filtra as colunas do Usuário Relacionado (Traz apenas o básico)
        usuario: {
          id: true,
          nome: true, // Ajuste para o nome da coluna de nome no seu sistema (ex: nome, nome_usuario)
        }
      }
    });
  }

  // 2. BUSCAR POR ID COM FILTRO DE COLUNAS
  async buscarPorId(id: number): Promise<APROVACOES> {
    const registro = await this.repository.findOne({
      where: { id: id },
      relations: ['usuario', 'nota'],
      select: {
        id: true,
        decisao: true,
        observacao: true,
        decidido_em: true,
        // 👇 Mesma filtragem para não carregar dados pesados no GET por ID
        nota: {
          id: true,
          numero_nf: true,
          fornecedor: true,
          valor_total: true,
          status: true,
          tem_anexo: true,
        },
        usuario: {
          id: true,
          nome: true,
        }
      }
    });

    if (!registro) {
      throw new NotFoundException(`Registro de aprovação ${id} não encontrado`);
    }
    return registro;
  }
  async alterar(id: number, dados: Partial<APROVACOES>): Promise<void> {
      const existe = await this.buscarPorId(id);
      if (existe) {
        await this.repository.update(id, dados);
      }
    }
  // Excluir (caso precise cancelar um registro)
  async excluir(id: number): Promise<void> {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.repository.delete(id);
    }
  }
}
