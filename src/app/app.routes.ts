import { Routes } from '@angular/router';
import { CominSoonComponent } from './pages/comin-soon/comin-soon.component';

// export const routes: Routes = [];
export const routes: Routes = [
    { path: '', component: CominSoonComponent },
    { path: '**', redirectTo: '' }
];
