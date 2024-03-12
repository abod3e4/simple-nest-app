import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PublicFolderPath } from '../constant';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ServicesModule } from 'src/modules/services/services.module';
import { BullModule } from '@nestjs/bull';

export const GlobalModules = [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
        rootPath: join(PublicFolderPath),
        renderPath: 'uploads',
    }),
    MongooseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
            return {
                autoIndex: config.get<boolean>('MONGO_AUTO_INDEX'),
                connectTimeoutMS: +config.get<number>('MONGO_CONNECT_TIMEOUT'),
                socketTimeoutMS: +config.get<number>('MONGO_SOCKET_TIMEOUT'),
                uri: config.get<string>('MONGO_URI'),
            };
        },
    }),
    ScheduleModule.forRoot(),
    I18nModule.forRootAsync({
        useFactory: (configService: ConfigService) => {
            return {
                fallbackLanguage: 'en',
                fallbacks: {
                    en: 'en',
                    ar: 'ar',
                },
                loaderOptions: {
                    path: join(process.cwd(), 'src', 'locales', 'i18n'),
                    watch: configService.get('NODE_ENV') === 'development',
                },
                typesOutputPath: join(process.cwd(), 'src/locales/generated/i18n.generated.ts'),
            };
        },
        inject: [ConfigService],
        resolvers: [
            {
                use: QueryResolver,
                options: ['lang'],
            },
            AcceptLanguageResolver,
        ],
    }),
   
   
    ServicesModule,
    
];
