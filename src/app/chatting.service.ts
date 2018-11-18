import { Injectable, EventEmitter, Output } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { VoiceListenerService } from './voice-listener.service';
import { isNullOrUndefined } from 'util';

declare var responsiveVoice: any;

@Injectable()
export class ChattingService {
  readonly client = new ApiAiClient({ accessToken: 'f437be1ab6ed48dfbc8f5e92e64141e8' });

  private waiting_for_more_info: boolean = false;

  public _answer: any = new RequestAnswer();
  @Output() finishedCommand:EventEmitter<String> = new EventEmitter();
  // @Output() dialogEnded: EventEmitter<RequestAnswer> = new EventEmitter();
  
  constructor(private _voiceListener: VoiceListenerService) {
    this.GetAnswers();
  }

  private _sub: any;

  public talkLoud(talk: String) {
    responsiveVoice.speak(talk, "Romanian Female", {rate: 1.3});
  }

  public activate_listener() {
    this._voiceListener.startRecognition();
    console.log("PULA");
    this.talkLoud("Am început să ascult");
  }

  public deactivate_listener() {
    this._voiceListener.stopRecognition();
    this._sub.unsubscribe();
  }

  public GetAnswers() {

    this._voiceListener.recognisedCommand.subscribe(command => {
      this.client.textRequest(command).then(response => {
        const incomplete = response['result']['actionIncomplete'];
        const intentName = response['result']['metadata']['intentName'];
        if(incomplete == true) {
          let missing = response['result']['fulfillment']['speech'];
          this.talkLoud(missing);
        } else {
          console.log(response);
              this._answer.intentName = intentName;
              this.finishedCommand.emit({intentName, ...response['result']['parameters']});
            }
        });
    });
  }

}

export class RequestAnswer {
  intentName: String;
  params: any;
}