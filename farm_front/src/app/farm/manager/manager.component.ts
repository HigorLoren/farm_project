import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { v4 as uuid } from 'uuid'
import { DrawAddon } from '@common/draw'
import GeoJSON from 'ol/format/GeoJSON'
import { MapService } from '../../map.service'
import { BasemapComponent } from '../../basemap/basemap.component'
import { GeoJsonFeatureAddon } from '@common/feature'
import { pointClickStyle, GeoJsonFeature } from '@common/geolib'
import { Owner } from '../../models/Owner'
import { Farm } from '../../models/Farm'
import { FarmService } from '../../services/farm.service'
import { OwnerService } from '../../services/owner.service'

const FARM_NAME_ERROR = 'Nome da fazenda é obrigatório!'
const FARM_INCLUDE_SUCCESS = 'Fazenda incluida com sucesso!'
const ACTION_TITLE = {
  create: 'Cadastrar',
  edit: 'Editar',
  delete: 'Deletar',
}

@Component({
  selector: 'app-farm-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class FarmManagerComponent implements OnInit {
  private _map!: BasemapComponent
  private _geometries: GeoJsonFeature[] = []

  constructor(
    private farmService: FarmService,
    private ownerService: OwnerService,
    private router: Router,
    private route: ActivatedRoute,
    private _mapService: MapService
  ) {}

  urlParams = {
    id: this.route.snapshot.paramMap.get('id') || '',
    action: this.route.snapshot.paramMap.get('action') || 'create',
  }

  farm: Farm = {
    centroid: [0, 0],
    geometry: {},
  } as Farm

  ownerSelected = {} as Owner
  owners: Owner[] = []

  errorMessage = ''
  successMessage = ''
  coordinates = ''
  actionTitle = ''

  private _actionRoutine = {
    create: () => this.loadCreateFarm(),
    edit: () => this.getFarm(this.urlParams.id),
    delete: () => this.deleteFarm(this.urlParams.id),
  }

  ngOnInit(): void {
    this._map = this._mapService.map

    if (!this._actionRoutine[this.urlParams.action]) {
      this.router.navigate(['/'])
      return
    }

    this._actionRoutine[this.urlParams.action]()
    this.actionTitle = ACTION_TITLE[this.urlParams.action]
  }

  loadCreateFarm() {
    this.farm.id = uuid()
    this.farm.geometry.type = 'Polygon'
    this.farm.geometry.coordinates = []
    this.coordinates = JSON.stringify(this.farm.geometry.coordinates)
    this.ownerService.list().subscribe((owners) => {
      this.owners = owners
      this.ownerSelected = owners[0]
    })
  }

  getFarm(id: string) {
    this.farmService.read(id).subscribe(
      (farm: Farm) => {
        this.ownerService.read(farm.owner_id).subscribe((owner) => {
          this.farm = farm
          this.coordinates = JSON.stringify(farm.geometry.coordinates)
          this.owners = [owner]
          this.ownerSelected = owner
        })
      },
      () => this.router.navigate(['/'])
    )
  }

  farmIsValid(farm: Farm) {
    this.errorMessage = ''
    this.successMessage = ''

    farm.geometry.coordinates = JSON.parse(this.coordinates)
    farm.owner_id = this.ownerSelected.id

    if (!farm['name']) {
      this.errorMessage = FARM_NAME_ERROR
      return false
    }

    return true
  }

  createFarm(farm: Farm) {
    if (this.farmIsValid(farm)) {
      this.farmService.create(farm).subscribe((farm) => {
        this.successMessage = FARM_INCLUDE_SUCCESS
      })
    }
  }

  updateFarm(farm: Farm) {
    if (this.farmIsValid(farm)) {
      this.farmService.update(farm).subscribe(
        () => {
          this.router.navigate(['/farm', farm.id, 'details'])
        },
        () => this.router.navigate(['/'])
      )
    }
  }

  deleteFarm(id: string) {
    this.farmService.delete(id).subscribe(
      () => {
        this.router.navigate(['/'])
      },
      () => this.router.navigate(['/'])
    )
  }

  draw(type: string) {
    if (!this._map) return
    this._map.includeAddon(
      new DrawAddon({
        identifier: 'geometry_map',
        drawType: type,
        callback: (geometry) => {
          const geo = new GeoJSON().writeGeometryObject(geometry) as any
          this.handleNewGeometry(geo)
        },
      })
    )
  }

  geometrySeed: number = 1
  handleNewGeometry(geometry: any) {
    const identifier = this.geometrySeed++
    this._map.includeAddon(
      new GeoJsonFeatureAddon({
        identifier: `geometry::${identifier}`,
        feature: geometry,
        styleFunction: () => {
          return pointClickStyle({
            hover: false,
            strokeColor: '#1962D1',
          })
        },
      })
    )
    this._map.fitToAddons(this._map.listByPrefix('geometry'))
    console.log('New geometry', geometry)
    this.farm.geometry.type = geometry.type
    this.farm.geometry.coordinates.push(geometry.coordinates)
    this.coordinates = JSON.stringify(this.farm.geometry.coordinates, null, 2)
    this._geometries.push(geometry)
  }

  ngOnDestroy() {
    this._map.removeByPrefix('geometry')
  }
}
