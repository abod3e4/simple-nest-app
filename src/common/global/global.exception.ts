import { APP_FILTER } from '@nestjs/core';
import AppExceptioFilter from '../exception-filter/all-exception.filter';

export const GlobalExceptionFilters = [
    {
        provide: APP_FILTER,
        useClass: AppExceptioFilter,
    },
];
