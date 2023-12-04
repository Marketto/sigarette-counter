import { Component } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import {
  Observable,
  distinctUntilChanged,
  map,
  mergeMap,
  shareReplay,
} from 'rxjs';
import * as moment from 'moment';
import { SigaretteType } from '../../core/models/data.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    private readonly dataService: DataService,
    private readonly router: Router
  ) {}

  public readonly smokedToday$: Observable<number> =
    this.dataService.history$.pipe(map((history) => history?.length || 0));

  public readonly lastSigaretteElapsedTime$: Observable<number> =
    this.dataService.history$.pipe(
      map((history) => history?.[0]),
      map((record) => moment().diff(moment(record?.date), 'minutes') || 0)
    );

  public readonly isSpareTobacco$: Observable<boolean> = this.dataService
    .getSettings()
    .pipe(
      map((settings) => settings?.type === SigaretteType.Bag),
      distinctUntilChanged(),
      shareReplay()
    );

  public add(): void {
    this.dataService.addLastSigarette().subscribe();
  }

  public remove(): void {
    this.dataService.removeLastSigarette().subscribe();
  }

  public outOfTobacco(): void {
    this.dataService
      .removeLastSigarette()
      .pipe(
        mergeMap((record) =>
          this.dataService.addLastSigarette({
            ...record,
            outOfTobacco: true,
          })
        )
      )
      .subscribe();
  }

  public advancedAdd(): void {
    this.router.navigate(['sigarette']);
  }

  public stats(): void {
    this.router.navigate(['stats']);
  }
}
