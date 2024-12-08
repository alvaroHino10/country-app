import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';
import { CountryTableComponent } from "../../components/country-table/country-table.component";

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  styles: ``,
})
export class ByCapitalPageComponent implements OnInit{
  constructor(private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCapital.countries;
    this.initialValue = this.countriesService.cacheStore.byCapital.term;
  }

  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialValue: string = '';

  searchByCapital(term: string): void {
    this.isLoading = true;
    const searchBy = 'capital';
    this.countriesService.search(term, searchBy).subscribe(countryList => {
      this.countries = countryList;
      console.log(countryList);
      this.isLoading = false;
    });

  }

}
