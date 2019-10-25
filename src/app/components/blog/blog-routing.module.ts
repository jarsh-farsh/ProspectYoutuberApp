import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogEntryComponent } from './blog-entry.component';

const routes: Routes = [
    { path: 'blog', component: BlogComponent },
    { path: 'blog/entry/:id', component: BlogEntryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }