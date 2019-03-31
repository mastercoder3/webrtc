//core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//packages
import { FilterPipeModule } from 'ngx-filter-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderModule } from  'ngx-ui-loader';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FirestoreSettingsToken } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { NavbarComponent } from './pages/shared/navbar/navbar.component';
import { SidebarComponent } from './pages/shared/sidebar/sidebar.component';
import { LoginComponent } from './pages/entry/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
import { SpinnerComponent } from './pages/shared/ui/spinner/spinner.component';


const routes = [
  {path: '' , redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, children: [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent}
  ]}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModalModule,
    NgbModule,
    NgxUiLoaderModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    FilterPipeModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
