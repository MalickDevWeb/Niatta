import { Routes } from '@angular/router';
import { SplashPageComponent } from './features/onboarding/pages/splash-page.component';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page.component';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { SearchPageComponent } from './features/search/pages/search-page.component';
import { MapPageComponent } from './features/map/pages/map-page.component';
import { ReportsPageComponent } from './features/reports/pages/reports-page.component';
import { ProfilePageComponent } from './features/profile/pages/profile-page.component';
import { ComparePageComponent } from './features/compare/pages/compare-page.component';
import { ProductDetailPageComponent } from './features/product/pages/product-detail-page.component';
import { ShopDetailPageComponent } from './features/shop/pages/shop-detail-page.component';


// Field Agent (homme_terrain)
import { TasksListComponent } from './features/field-agent/tasks-list.component';
import { TaskDetailComponent } from './features/field-agent/task-detail.component';
import { FieldAgentLoginPageComponent } from './features/auth/pages/field-agent-login-page.component';

export const routes: Routes = [
  { path: '', component: SplashPageComponent },
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/register', component: RegisterPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'compare', component: ComparePageComponent },
  { path: 'map', component: MapPageComponent },
  { path: 'reports', component: ReportsPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'product/:id', component: ProductDetailPageComponent },
  { path: 'shop/:id', component: ShopDetailPageComponent },
  
  // Admin routes (Moved to Next.js Back-Office)
  
  // Field Agent routes
  { path: 'homme-terrain/login', component: FieldAgentLoginPageComponent },
  { path: 'homme-terrain', component: TasksListComponent },
  { path: 'homme-terrain/:id', component: TaskDetailComponent },
  
  { path: '**', redirectTo: '' }
];
