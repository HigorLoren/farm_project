import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AppComponent } from './app.component'
import { FarmComponent } from './farm/farm.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { FarmManagerComponent } from './farm/manager/manager.component'
import { FarmDetailsComponent } from './farm/details/details.component'

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'farm', component: FarmComponent },
  { path: 'farm/create', component: FarmManagerComponent },
  { path: 'farm/:id/details', component: FarmDetailsComponent },
  { path: 'farm/:id/:action', component: FarmManagerComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
