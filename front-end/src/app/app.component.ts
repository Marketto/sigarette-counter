import { Component } from '@angular/core';
import { ApiService } from './core/services/api.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private readonly apiService: ApiService) {}

  public readonly userName$ = this.apiService
    .user()
    .pipe(map(({ given_name }) => given_name));
}
