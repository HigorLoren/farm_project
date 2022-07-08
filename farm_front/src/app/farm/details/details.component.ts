import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { Farm } from '../../models/Farm'
import { FarmService } from '../../services/farm.service'

@Component({
  selector: 'app-farm-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class FarmDetailsComponent implements OnInit {
  constructor(
    private farmService: FarmService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  farm = {
    centroid: [0, 0],
  } as Farm

  ngOnInit(): void {
    const paramFarmId: string = this.route.snapshot.paramMap.get('id') || ''
    if (paramFarmId) this.getFarm(paramFarmId)
  }

  getFarm(id: string) {
    this.farmService.read(id).subscribe(
      (farm: Farm) => {
        this.farm = farm
      },
      (err) => this.router.navigate(['/'])
    )
  }
}
