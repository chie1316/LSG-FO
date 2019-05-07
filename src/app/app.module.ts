import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GuestService } from '@lsg/service-guest/guest.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import {
  MatButtonModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule,
  MatIconModule, MatCardModule, MatSidenavModule,MatFormFieldModule,
  MatInputModule, MatTooltipModule, MatToolbarModule
} from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuestComponent } from '@lsg/component-guest/guest.component';
import { MemberComponent } from '@lsg/component-member/member.component';

@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    MemberComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [HttpClientModule, GuestService, MatDatepickerModule, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
