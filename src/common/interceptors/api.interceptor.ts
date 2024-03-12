import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, map } from 'rxjs';
import FileDeleteService from '../util/file-delete.service';

@Injectable()
export default class ApiInterceptor implements NestInterceptor {
    constructor(private fileDelete: FileDeleteService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        let status = HttpStatus.OK;
        if (request.method == 'POST') {
            status = HttpStatus.CREATED;
        }

        return next.handle().pipe(
            map((data) => {
                return { success: true, statusCode: status, data };
            }),
            catchError(async (err, caught) => {
                if (request.file) {
                    await this.fileDelete.deleteSingleFile(request.file);
                } else if (
                    (request.files as Express.Multer.File[]) &&
                    Array.isArray(request.files as Express.Multer.File[])
                ) {
                    await this.fileDelete.deleteMultipleFiles(request.files as Express.Multer.File[]);
                } else if (request.files && typeof request.files === 'object' && !Array.isArray(request.files)) {
                    await this.fileDelete.deleteMultipleFieldFile(
                        request.files as Record<string, Express.Multer.File[]>,
                    );
                }

                throw err;
            }),
        );
    }
}
