import { Test, TestingModule } from '@nestjs/testing';
import { VoiceStateService } from './voice-state.service';

describe('VoiceStateService', () => {
  let service: VoiceStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceStateService],
    }).compile();

    service = module.get<VoiceStateService>(VoiceStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
