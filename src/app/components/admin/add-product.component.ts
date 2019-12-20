import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalMessageService } from 'src/app/services/global-message.service';
import { AdminDialogComponent } from './admin-dialog.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { ProductTag } from 'src/app/models/ProductTag';

const imageURL = "http://localhost:4000/api/images";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  id: number = 0;
  prodForm: FormGroup;

  productTags: ProductTag[] = [];
  availableTags: ProductTag[] = [];
  selectedTags: ProductTag[] = [];

  showImages: boolean;
  showImageMessage: string;

  productImages: File[] = null;
  imagePaths: string[];
  imageUrls: any[]
  allowedImageFormat: string[] = ["jpeg", "jpg", "png"]

  addingProduct: boolean = false;
  addingProductTag: boolean = false;
  addingImages: boolean = false;

  constructor(private http: HttpClient,
              private productService: ProductService,
              private fb: FormBuilder,
              private gmService: GlobalMessageService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.prodForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required, Validators.maxLength(15)]],
      quantity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    })

    this.productService.getTags().subscribe({
      next: tags => {
        this.productTags = tags;
        this.availableTags = this.productTags;
      },
      error: err => {
        console.error("Issue getting tags");
      }
    })

    this.showImages = false;
    this.showImageMessage = "Show All Images";
   }

  onFileSelected(event){
    this.addingImages = true;
    this.productImages = event.target.files;
    this.insertImageUrls(this.productImages);
    event.srcElement.value = null;
  }

  insertImageUrls(files: any[]){
    this.imageUrls = [];
    this.imagePaths = [];
    var tmp: File[] = [];
    for(var i = 0; i < files.length; i++){
      if(!this.checkImageExt(files[i].name)) {
        this.gmService.addMessage(`${files[i].name} is not an image file`, 'error');
        continue;
      };
      tmp.push(files[i]);
      this.getImageData(files[i]);
    }

    this.productImages = tmp;
    this.addingImages = false;
  }

  getImageData(file: File){
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.imageUrls.push(reader.result);
    }
  }

  checkImageExt(fileName: string):boolean{
    var exist = this.allowedImageFormat.find(f => f === fileName.split('.').pop());
    if(exist){
      return true;
    }
    return false;
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
      error: err => this.gmService.addMessage("There was an issue adding the images selected.", "error")
    })
  }

  changeMainImage(i){
    var tmp = this.imageUrls[0];
    var tmp2 = this.productImages[0];
    this.imageUrls[0] = this.imageUrls[i];
    this.productImages[0] = this.productImages[i];
    this.imageUrls[i] = tmp;
    this.productImages[i] = tmp2;
  }

  removeImage(index){
    this.imageUrls.splice(index, 1);
    if(this.imageUrls.length === 0) this.imageUrls = null;
  }

  toggleImages(){
    this.showImages = !this.showImages;
    if(this.showImages) this.showImageMessage = "Hide All Images";
    else this.showImageMessage = "Show All Images"
  }

  addTag(index){
    this.selectedTags.push(this.availableTags[index]);
    this.availableTags.splice(index, 1);
    this.sortTags();
  }

  removeTag(index){
    this.availableTags.push(this.selectedTags[index]);
    this.selectedTags.splice(index, 1);
    this.sortTags();
  }

  sortTags(){
    this.selectedTags.sort(this.sortByName);
    this.availableTags.sort(this.sortByName);
  }

  sortByName(a, b){
    if(a.name > b.name){
      return 1;
    }
    if(a.name < b.name){
      return -1;
    }
    return 0;
  };

  priceChanged(){
    var newVal = ((this.prodForm.get('price').value * 100) / 100).toFixed(2);
    this.prodForm.controls['price'].setValue(newVal);  
  }

  confirmProd(){
    var images = [];
    var tags = [];
    if(this.productImages) this.productImages.forEach(f => images.push(f.name))
    if(this.selectedTags) this.selectedTags.forEach(t => tags.push(t.id));
    var product = this.mapProduct();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    
    dialogConfig.data = {
      title: "Confirm Product Addition",
      description: "Are you sure that you would like to add this product?",
      images: images,
      product: product,
      tags: this.selectedTags
    }

    const dialogRef = this.dialog.open(AdminDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: confirm => {
        if(confirm){
          var data = { 
            product: product,
            image_urls: images,
            tags: tags
          }
          this.productService.addProduct(data).subscribe({
            next: res => {
              if(!res.error){
                this.gmService.addMessage("Successfully added " + product.name, "success");
                this.clearData();
              }else{
                this.gmService.addMessage("There was an issue adding the product.", "error");
              }
            },
            error: err => {
              this.gmService.addMessage("There was an issue adding the product.", "error")
            }
          })
        }
      },
      error: err => {
        this.gmService.addMessage('There was an error adding your product', 'error');
      }
    })
  }

  clearData(){
    this.prodForm.reset();
    this.productImages = null;
    this.imageUrls = null;
  }

  mapProduct(): Product{
    var product = new Product();
    product.name = this.prodForm.get('name').value;
    product.description = this.prodForm.get('description').value;
    product.quantity_in_stock = this.prodForm.get('quantity').value;
    product.price = this.prodForm.get('price').value;
    return product;
  }

}
