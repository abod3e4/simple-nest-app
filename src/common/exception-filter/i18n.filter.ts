import { ArgumentsHost, Catch, ExceptionFilter, ValidationError } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';
import { I18nValidationExceptionFilterErrorFormatterOption } from 'nestjs-i18n/dist/interfaces/i18n-validation-exception-filter.interface';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';
import { IErrorResponse } from './types';
type I18nValidationExceptionFilterOptions = I18nValidationExceptionFilterErrorFormatterOption;

@Catch(I18nValidationException)
export class I18nExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly options: I18nValidationExceptionFilterOptions = {
            errorFormatter: (errors: ValidationError[]) => {
                function mapErrors(ele: ValidationError) {
                    if (Object.keys(ele.constraints).length !== 0) {
                        return Object.values(ele.constraints);
                    } else if (ele.children.length !== 0) {
                        return mapErrors(ele.children[0]);
                    } else {
                        return errors;
                    }
                }

                return errors.map((ele) => mapErrors(ele)).flat();
            },
            errorHttpStatusCode: 422,
        },
    ) {}
    catch(exception: I18nValidationException, host: ArgumentsHost): void {
        const i18n = I18nContext.current();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse() as Response;

        const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
            lang: i18n.lang,
        });

        const message = this.options.errorFormatter(errors);

        const httpStatus = this.options.errorHttpStatusCode;

        const responseBody: IErrorResponse = {
            success: false,
            statusCode: httpStatus,
            message: message[0],
        };

        response.status(httpStatus).send(responseBody);
    }
}
