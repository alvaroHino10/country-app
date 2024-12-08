import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap, tap } from 'rxjs';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit {

  public country?: Country;

  constructor(
    private activatedRoute: ActivatedRoute,
    private countriesService: CountriesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.
    pipe(
      switchMap(params => this.countriesService.searchCountryByAlphaCode(params['id']) ) // switchMap is used to return an observable
    )
    .subscribe(country => {
      if (!country) {
        this.router.navigateByUrl('/countries');
        return;
      }
      this.country = country;
      console.log(`Country: ${country.name.common}`);
    });
  }
}
