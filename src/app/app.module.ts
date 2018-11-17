import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material';
import { MaterialModule } from './material/material.module';
import { HttpClientModule }    from '@angular/common/http';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MaterialModule,
    HttpClientModule,
    AmplifyAngularModule
  ],
  providers: [
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
