import { Test, TestingModule } from '@nestjs/testing';
import { AprovaçoesController } from './aprovacoes.controller';
import { AprovaçoesService } from './aprovacoes.service';
import { beforeEach, describe } from 'node:test';

describe('AprovaçoesController', () => {
  let controller: AprovaçoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AprovaçoesController],
      providers: [AprovaçoesService],
    }).compile();

    controller = module.get<AprovaçoesController>(AprovaçoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
