import { TestBed } from '@angular/core/testing';

import { VoiceListenerService } from './voice-listener.service';

describe('VoiceListenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoiceListenerService = TestBed.get(VoiceListenerService);
    expect(service).toBeTruthy();
  });
});
