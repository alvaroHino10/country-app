import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {
  private apiUrl = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  }

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    return this.httpClient.get<Country[]>(`${this.apiUrl}/alpha/${code}`)
    .pipe(
      map((countries) => countries.length > 0 ? countries[0] : null),
      catchError(error => of(null))
    );
  }

  private updateCache(term: string, countries: Country[], searchBy: string): void {
    if (searchBy === 'capital') {
      this.cacheStore.byCapital = { term, countries };
    } else if (searchBy === 'name') {
      this.cacheStore.byCountries = { term, countries };
    } else if (searchBy === 'region') {
      this.cacheStore.byRegion = { region: term as Region, countries };
    }
  }

  search(term: string, searchBy: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.apiUrl}/${searchBy}/${term}`)
      .pipe(
        tap((countries) => this.updateCache(term, countries, searchBy)),
        tap( () => this.saveToLocalStorage() ),
        catchError(error => of([]))
      );
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(): void {
    const cacheStore = localStorage.getItem('cacheStore');
    if (cacheStore) {
      this.cacheStore = JSON.parse(cacheStore);
    }
  }
}
