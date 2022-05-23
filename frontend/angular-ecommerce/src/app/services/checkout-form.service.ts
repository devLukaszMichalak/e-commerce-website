import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

private countriesUrl = "http://localhost:8080/api/countries";
private statesUrl = "http://localhost:8080/api/states";

  constructor(private httpCliennt: HttpClient) { }

  getCounntries(){
    return this.httpCliennt.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchStatesUrl:string = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`; 

    return this.httpCliennt.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++ ){
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = 10;

    for(let theYear = startYear; theYear <= startYear+endYear; theYear++ ){
      data.push(theYear);
    }

    return of(data);
  }

}

interface GetResponseCountries {
_embedded:{
  countries: Country[];
}
}

interface GetResponseStates {
  _embedded:{
    states: State[];
  }
  }
