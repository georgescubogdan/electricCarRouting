import { TestBed } from '@angular/core/testing';

import { ChattingService } from './chatting.service';

describe('ChattingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChattingService = TestBed.get(ChattingService);
    expect(service).toBeTruthy();
  });
});
