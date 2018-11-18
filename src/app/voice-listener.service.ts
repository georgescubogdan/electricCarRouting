import { Injectable, EventEmitter, Output } from '@angular/core';
declare var responsiveVoice: any;

declare var window: any;
@Injectable()
export class VoiceListenerService {
  recognition = new window.webkitSpeechRecognition();
  @Output() recognisedCommand:EventEmitter<String> = new EventEmitter();
  
  public startRecognition() {
    this.recognition.start();    
  }
  
  public stopRecognition() {
    console.log("Stop");
    this.recognition.abort();    
  }

  constructor() { 
    this.recognition.lang = "ro-RO";
    this.recognition.interminResults = false;
    // this.recognition.start();
    
    this.recognition.addEventListener('result', (e) => {
      let last = e.results.length - 1;
      let text: String = e.results[last][0].transcript;
      
      
      console.log(text + " -> " + text.toLocaleLowerCase().indexOf("ioana"));
      if(text.toLocaleLowerCase().indexOf("ioana") != -1) {
        this.recognisedCommand.emit(text.substring(text.toLowerCase().indexOf("ioana") + 6));
      }
    });

    this.recognition.addEventListener('start', (e) => {
      console.log("start");
    });

    this.recognition.addEventListener('end', (e) => {
      console.log("ended");
      this.recognition.start();
    });
  }
}

