import { Test, TestingModule } from '@nestjs/testing';
import { BwlService } from './bwl.service';

describe('BwlService', () => {
  let service: BwlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BwlService],
    }).compile();

    service = module.get<BwlService>(BwlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
