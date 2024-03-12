import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FOLDER_TOKEN } from '../../constant';
import { uploadImage } from '../../factory/image-upload.factory';

@Injectable()
export default class ImageInterceptor implements NestInterceptor {
    constructor(@Inject(FOLDER_TOKEN) private folderName: string) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const file = request.file;

        if (!file) return next.handle();

        request.file = await uploadImage(file, this.folderName);

        return next.handle();
    }
}
