import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { IMG_UTILS } from 'src/app/utils/utilities';

@Pipe({
    name: 'checkImgUrl'
})

export class CheckImgUrlPipe implements PipeTransform {

    constructor(private http: HttpClient){ }

    transform(url: string): any{
        return this.http.get<any>(url).pipe(
            map(data => {
                return url
            }),
            catchError(error => {
                return IMG_UTILS.NoImageAvailable()
            })
        )
    }
}