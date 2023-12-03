import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs';

@Component({
  templateUrl: './sigarette.component.html',
})
export class SigaretteComponent implements OnInit {
  public date: Date | null | undefined;
  public outOfTobacco?: boolean;

  constructor(
    private readonly dataService: DataService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.date = new Date();
  }

  setDate(date: string): void {
    const curDt = this.date;
    if (date) {
      this.date = moment(date).toDate();
      if (curDt) {
        this.date.setHours(curDt.getHours());
        this.date.setMinutes(curDt.getMinutes());
      }
    } else {
      this.date = null;
    }
  }

  setTime(time: string): void {
    if (this.date && time) {
      const [hours, minutes] = time.split(':');
      this.date.setHours(parseInt(hours));
      this.date.setMinutes(parseInt(minutes));
    }
  }

  addSigarette() {
    if (this.date) {
      this.dataService
        .addLastSigarette({
          date: this.date,
          outOfTobacco: this.outOfTobacco,
        })
        .pipe(mergeMap(() => this.router.navigate(['..'])))
        .subscribe();
    }
  }
}
