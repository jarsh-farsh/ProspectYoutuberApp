import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const HTTP_UTILS ={
    handleError(err: HttpErrorResponse){
        let errorMessage = '';
        if(err.error instanceof ErrorEvent){
          errorMessage = `An error occurred: ${err.error.message}`;
        }else{
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}

export const IMG_UTILS = {
    imageExists(url){
        
    },
    NoImageAvailable(){
        return environment.imagesUrl + "no-picture.jpg";
    },
    GetImageUrl(imageName: string){
        if(!imageName) return IMG_UTILS.NoImageAvailable();
        return environment.imagesUrl + imageName;
    }
}

export const ARRAY_UTILS = {
    sortByNameDesc(a, b){
        if(a.name > b.name){
            return -1;
        }else if(a.name < b.name){
            return 1;
        }
        return 0;
    },

    sortByNameAsc(a, b){
        if(a.name < b.name){
            return -1;
        }else if(a.name > b.name){
            return 1;
        }
        return 0;
    },

    sortByDateDesc(a, b){
        if(a > b) return - 1;
        if(b < b) return 1;
        return 0;
    },

    sortByDateAsc(a, b){
        if(a < b) return - 1;
        if(b > b) return 1;
        return 0;
    }
}

export const DATA_UTILS = {
    generateOrderNumber(){
        return Math.random().toString(36).substr(2, 5) + performance.now().toString().replace('.', '');
    }
}