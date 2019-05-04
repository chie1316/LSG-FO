import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestDto } from './guestDto';
import { Guest } from './Guest';
import { GuestResponseDto } from './guest-response-dto';
import { MainResponseObject } from './main-response-object'
@Injectable({
  providedIn: 'root'
})

export class GuestService {
  url = 'http://localhost:8080/lsg/registration';

  constructor(private http: HttpClient) { }

  getAllGuest(): Observable<GuestResponseDto[]> {
   return this.http.get<GuestResponseDto[]>(this.url + '/getGuests');
  }

  getGuestId(guestId: string): Observable<GuestResponseDto> {
     return this.http.get<GuestResponseDto>(this.url + '/getGuestDetailsById?id=' + guestId);
   }

  addGuest(newGuest: GuestDto): Observable<MainResponseObject> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.post<MainResponseObject>(this.url + '/addGuest',
    newGuest, httpOptions);
  }

  updateGuest(guest: GuestDto): Observable<MainResponseObject> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.put<MainResponseObject>(this.url + '/updateGuest',
    guest, httpOptions);
  }

  removeGuestById(guestId: string): Observable<GuestResponseDto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.delete<GuestResponseDto>(this.url + '/removeGuest?id=' + guestId,
    httpOptions);
  }
}
