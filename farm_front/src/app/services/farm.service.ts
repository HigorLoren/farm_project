import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'

import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { Farm } from './../models/Farm'
import { environment } from '../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  farmEndpoint = `${environment.apiUrl}/farms`

  constructor(private http: HttpClient) {}

  create(farm: Farm): Observable<Farm> {
    return this.http
      .post<Farm>(`${this.farmEndpoint}`, farm, httpOptions)
      .pipe(retry(2), catchError(this.handleError))
  }

  read(id: string): Observable<Farm> {
    return this.http
      .get<Farm>(`${this.farmEndpoint}/${id}`, httpOptions)
      .pipe(catchError(this.handleError))
  }

  update(farm: Farm): Observable<Farm> {
    return this.http
      .put<Farm>(`${this.farmEndpoint}/${farm.id}`, farm, httpOptions)
      .pipe(retry(2), catchError(this.handleError))
  }

  delete(id: string): Observable<Farm> {
    return this.http
      .delete<Farm>(`${this.farmEndpoint}/${id}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError))
  }

  list(): Observable<Farm[]> {
    return this.http
      .get<Farm[]>(`${this.farmEndpoint}/`, httpOptions)
      .pipe(catchError(this.handleError))
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Client side error
      errorMessage = error.error.message
    } else {
      // Server side error
      errorMessage = `Error code: ${error.status}, ` + `message: ${error.message}`
    }
    console.log(errorMessage)
    return throwError(errorMessage)
  }
}
