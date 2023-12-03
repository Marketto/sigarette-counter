import { Injectable } from '@angular/core';
import { IData, ISmokeHistory } from '../models/data.model';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  interval,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  public readonly history$: BehaviorSubject<ISmokeHistory[]> =
    new BehaviorSubject([] as ISmokeHistory[]);

  constructor(private readonly apiService: ApiService) {
    this.load();
  }

  private load() {
    interval(5 * 3600000)
      .pipe(
        startWith(null),
        switchMap(() => this.getHistory()),
        tap((data) => {
          this.history$.next(data);
        })
      )
      .subscribe();
  }

  public getSettings() {
    return this.apiService.settings().read();
  }

  public getHistory(date: Date = new Date()): Observable<ISmokeHistory[]> {
    return this.apiService.history().read({ date });
  }

  public addLastSigarette(
    record?: Omit<ISmokeHistory, 'id'>
  ): Observable<void> {
    const recordData: Omit<ISmokeHistory, 'id'> = {
      ...(record || {}),
      date: record?.date || new Date(),
    };
    return this.apiService
      .history()
      .create(recordData)
      .pipe(
        tap((insertedRecord) => {
          const history = this.history$.getValue() || {};
          const newHistory = [insertedRecord, ...(history || [])];
          this.history$.next(newHistory);
        }),
        map(() => undefined)
      );
  }

  public removeLastSigarette(): Observable<ISmokeHistory> {
    const lastRecord = this.history$.getValue()?.[0];
    if (!lastRecord?.id) {
      return EMPTY;
    }
    return this.apiService
      .history(lastRecord?.id)
      .delete()
      .pipe(
        map(() => this.history$.getValue() || {}),
        map((history) => (history || []).slice(1)),
        tap((history) => {
          this.history$.next(history);
        }),
        map(() => lastRecord)
      );
  }

  public saveSettings(settings: IData['settings']): Observable<void> {
    return this.apiService
      .settings()
      .update(settings)
      .pipe(
        map(() => ({
          ...(this.history$.getValue() || {}),
          settings,
        })),
        tap((newData) => {
          this.history$.next(newData);
        }),
        map(() => undefined)
      );
  }
}
