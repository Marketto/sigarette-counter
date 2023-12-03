import { Component } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  templateUrl: './stats.component.html',
})
export class StatsComponent {
  constructor(private readonly dataService: DataService) {}
}
