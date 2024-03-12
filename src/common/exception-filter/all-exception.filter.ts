import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { IErrorResponse } from './types';

@Catch()
export default class AppExceptioFilter implements ExceptionFilter {
    constructor(private httpAdapterHost: HttpAdapterHost) {}

    async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        let message = exception.message.toString() || 'INTERNAL_SERVER_ERROR';
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof ThrottlerException) {
            message = 'Too many requests on this route, please try again later.';
            status = HttpStatus.TOO_MANY_REQUESTS;
        }

        if (exception instanceof HttpException) {
            const { response } = exception as any;
            message = Array.isArray(response.message) ? response.message[0] : response.message;
            status = exception.getStatus();
        }

        const response: IErrorResponse = {
            success: false,
            statusCode: status,
            message,
        };

        const { httpAdapter } = this.httpAdapterHost;
        httpAdapter.reply(ctx.getResponse(), response, status);
    }
}
