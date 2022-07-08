import { Component, OnInit } from '@angular/core'
import { FarmService } from '../services/farm.service'
import { Farm } from '../models/Farm'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  farms: Farm[] = []

  constructor(private farmService: FarmService) {}

  ngOnInit() {
    this.getFarm()
  }

  getFarm() {
    this.farmService.list().subscribe((farms: Farm[]) => {
      this.farms = farms
    })
  }
}
