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
  { path: '**', redirectTo: '' }
];
