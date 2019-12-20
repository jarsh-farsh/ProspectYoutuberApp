import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { BlogEntryComponent } from './blog-entry.component';
import { BlogDialogComponent } from './blog-dialog.component';

@NgModule({
  declarations: [
    BlogComponent,
    BlogDialogComponent,
    BlogEntryComponent
  ],
  imports: [
    SharedModule,
    BlogRoutingModule
  ],
  entryComponents: [BlogDialogComponent]
})
export class BlogModule { }
