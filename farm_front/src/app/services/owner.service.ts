import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable } from 'rxjs'

import { Owner } from './../models/Owner'
import { environment } from '../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  ownerEndpoint = `${environment.apiUrl}/owners`

  constructor(private http: HttpClient) {}

  list(): Observable<Owner[]> {
    return this.http.get<Owner[]>(`${this.ownerEndpoint}/`, httpOptions)
  }

  read(id: string): Observable<Owner> {
    return this.http.get<Owner>(`${this.ownerEndpoint}/${id}`, httpOptions)
  }
}
