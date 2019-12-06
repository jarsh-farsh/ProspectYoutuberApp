import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog-dialog',
  templateUrl: './blog-dialog.component.html',
  styleUrls: ['./blog-dialog.component.css']
})
export class BlogDialogComponent implements OnInit {

  title: string;
  description: string;
  form: FormGroup;
  isComment: boolean;
  isBlogEdit: boolean;
  isBlogDelete: boolean;
  isBlogConfirm: boolean;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<BlogDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) { 
                if(data.isComment) {
                  this.isComment = data.isComment;
                  this.title = "Confirm Comment Deletion"
                  this.description = "Are you sure you want to delete the comment?"
                }
                if(data.isBlogEdit) { 
                  this.isBlogEdit = data.isBlogEdit;
                  this.title = "Edit"
                  this.form = this.fb.group({
                    title: [data.title, [Validators.required]],
                    body: [data.body, [Validators.required]]
                  })
                }
                if(data.isBlogDelete) {
                  this.isBlogDelete = data.isBlogDelete;
                  this.title = "Confirm Blog Deletion"
                  this.description = "Are you sure you want to delete this blog entry?"
                }
                if(data.isBlogConfirm) {
                  this.isBlogConfirm = data.isBlogConfirm;
                  this.title = "Confirm Blog Submit"
                  this.description = "Are you sure you want to confirm this blog entry?"
                }
              }

  ngOnInit() {

  }

  confirm(){
    var data;
    if(this.isBlogEdit) {
      data = {
        choice: true,
        title: this.form.get('title').value,
        body: this.form.get('body').value
      };
    }
    else data = true;

    this.dialogRef.close(data);
  }

  cancel(){
    this.dialogRef.close(false);
  }

}
