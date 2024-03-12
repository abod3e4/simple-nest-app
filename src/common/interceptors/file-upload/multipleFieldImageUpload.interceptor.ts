import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { FOLDER_TOKEN } from '../../constant';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { uploadImage } from '../../factory/image-upload.factory';

@Injectable()
export default class MultipleFieldImagesInterceptor implements NestInterceptor {
    constructor(@Inject(FOLDER_TOKEN) private folderName: string) {}

    async intercept(ctx: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = ctx.switchToHttp().getRequest() as Request;
        const files = request.files as Record<string, Express.Multer.File[]>;

        for (let field of Object.keys(files)) {
            let uploadedFiles: Express.Multer.File[] = await Promise.all(
                files[field].map(async (file) => await uploadImage(file, this.folderName)),
            );
            files[field] = uploadedFiles;
        }

        return next.handle();
    }
}
