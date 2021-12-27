import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ListComponent } from './results/list/list.component';
import { TableComponent } from './results/list/table/table.component';
import { ChartComponent } from './results/list/chart/chart.component';
import { MeteogramComponent } from './results/list/meteogram/meteogram.component';
import { DetailsComponent } from './results/details/details.component';

const routes: Routes = [
  // { path: '', redirectTo: '/results', pathMatch: 'full' },
  { path: 'results', component: ResultsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '/results', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }