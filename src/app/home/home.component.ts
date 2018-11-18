import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { VoiceListenerService } from '../voice-listener.service';
import { ChattingService } from '../chatting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private loginService : LoginService, private router: Router, private _voiceService: VoiceListenerService, private _chattingService: ChattingService) { }

  ngOnInit() {
    this.loginService.stateObservable.subscribe(e => {
      //console.log(e);
      if (e === false)
        this.router.navigate(['login']);
    });

    this._chattingService.activate_listener();
    this._chattingService.finishedCommand.subscribe(cmd => console.log(cmd));
  }

  stopVoice() {
    this._voiceService.stopRecognition();
  }

}
