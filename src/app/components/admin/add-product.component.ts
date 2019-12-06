import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';

const imageURL = "http://localhost:4000/api/images";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productImages: File[] = null;
  uploader:FileUploader = new FileUploader({url: imageURL, itemAlias: 'photo'});

  constructor(private http: HttpClient,
              private fb: FormBuilder) { }

  ngOnInit() {

  }

  onFileSelected(event){
    this.productImages = event.target.files;
  }

  uploadFiles(){
    const formData: any = new FormData();
    const files: Array<File> = this.productImages;
    console.log(files);

    for(var i = 0; i < files.length; i++){
      formData.append('uploads', files[i], files[i].name);
    }
    console.log('form data variable: ' + formData);
    this.http.post(imageURL, formData).subscribe({
      next: data => console.log(data)
    })
  }
}
