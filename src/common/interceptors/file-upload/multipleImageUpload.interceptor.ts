import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { FOLDER_TOKEN } from '../../constant';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { uploadImage } from '../../factory/image-upload.factory';

@Injectable()
export default class MultipleImagesInterceptor implements NestInterceptor {
    constructor(@Inject(FOLDER_TOKEN) private folderName: string) {}

    async intercept(ctx: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = ctx.switchToHttp().getRequest() as Request;
        const files = request.files as Express.Multer.File[];

        request.files = await Promise.all(files.map(async (file) => await uploadImage(file, this.folderName)));

        return next.handle();
    }
}
