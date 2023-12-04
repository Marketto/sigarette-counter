import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { IData, SigaretteType } from '../../core/models/data.model';
import { map, mergeMap, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'settings.component.html',
})
export class SettingsComponent implements OnInit {
  public readonly SigaretteType = SigaretteType;

  public settings: IData['settings'] = {} as IData['settings'];

  constructor(
    private readonly dataService: DataService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.dataService
      .getSettings()
      .pipe(
        map(
          (settings) =>
            ({
              ...settings,
              filters: settings?.filters || {},
              papers: settings?.papers || {},
            } as IData['settings'])
        ),
        take(1)
      )
      .subscribe((settings) => {
        this.settings = settings;
      });
  }

  public save(): void {
    this.dataService
      .saveSettings(this.settings)
      .pipe(mergeMap(() => this.router.navigate(['..'])))
      .subscribe();
  }
}
