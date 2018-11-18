import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';
import {AgmCoreModule} from '@agm/core';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { HttpClientModule }    from '@angular/common/http';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { LoginComponent } from './login/login.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { HistoryComponent } from './history/history.component';
import { HistoryNavComponent } from './history-nav/history-nav.component';
import { RoutesComponent } from './routes/routes.component';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';
import { VoiceListenerService } from './voice-listener.service';
import { ChattingService } from './chatting.service';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SideNavComponent,
    HistoryComponent,
    HistoryNavComponent,
    RoutesComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatIconModule,
    MaterialModule,
    HttpClientModule,
    AmplifyAngularModule,
    MatGoogleMapsAutocompleteModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAyfjHiYM9wOoWxCHaTVv5nabpxoAqaLhM',
      libraries: ['geometry', 'places'],
      language: 'en',
  }) 
  ],
  providers: [
    AmplifyService,
    MapService,
    VoiceListenerService,
    ChattingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
