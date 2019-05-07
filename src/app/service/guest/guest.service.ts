import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GuestDto } from '@lsg/dto/guest-dto';
import { Guest } from '@lsg/model/guest';
import { GuestResponseDto } from '@lsg/dto/guest-response-dto';
import { MainResponseObjectDto } from '@lsg/dto/main-response-object-dto';
import { FilterDto } from '@lsg/dto/filter-dto';

@Injectable({
  providedIn: 'root'
})

export class GuestService {
  url = 'http://localhost:8080/lsg/guest';

  constructor(private http: HttpClient) { }

  getAllGuests(filter: FilterDto): Observable<GuestResponseDto[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<GuestResponseDto[]>(this.url + '/getGuests', filter, httpOptions);
  }

  getGuestId(guestId: string): Observable<GuestResponseDto> {
    return this.http.get<GuestResponseDto>(this.url + '/getGuestDetailsById?id=' + guestId);
  }

  addGuest(newGuest: GuestDto): Observable<MainResponseObjectDto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<MainResponseObjectDto>(this.url + '/addGuest',
      newGuest, httpOptions);
  }

  updateGuest(guest: GuestDto): Observable<MainResponseObjectDto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<MainResponseObjectDto>(this.url + '/updateGuest',
      guest, httpOptions);
  }

  removeGuestById(guestId: string): Observable<GuestResponseDto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<GuestResponseDto>(this.url + '/removeGuest?id=' + guestId,
      httpOptions);
  }
}
