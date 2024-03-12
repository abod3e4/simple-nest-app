import { APP_INTERCEPTOR } from '@nestjs/core';
import ApiInterceptor from '../interceptors/api.interceptor';

export const GlobalInterceptors = [{ provide: APP_INTERCEPTOR, useClass: ApiInterceptor }];
