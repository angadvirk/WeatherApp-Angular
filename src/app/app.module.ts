// Components
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ListComponent } from './results/list/list.component';
import { TableComponent } from './results/list/table/table.component';
import { ChartComponent } from './results/list/chart/chart.component';
import { MeteogramComponent } from './results/list/meteogram/meteogram.component';
import { DetailsComponent } from './results/details/details.component';
// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HighchartsChartModule } from 'highcharts-angular';
// Services
import { DataService } from './data.service';
import { HttpService } from './http.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    FavoritesComponent,
    ListComponent,
    TableComponent,
    ChartComponent,
    MeteogramComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    HighchartsChartModule,
  ],
  providers: [
    DataService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
