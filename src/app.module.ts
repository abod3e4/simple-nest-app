import { Module } from '@nestjs/common';

import { GlobalExceptionFilters, GlobalInterceptors, GlobalModules } from './common';

@Module({
    imports: [...GlobalModules],
    providers: [...GlobalExceptionFilters, ...GlobalInterceptors],
})
export class AppModule {}
