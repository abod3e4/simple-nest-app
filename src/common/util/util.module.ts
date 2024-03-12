import { Global, Module } from '@nestjs/common';
import FileDeleteService from './file-delete.service';

import { TranslateException } from './translate.exciption.service';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';


@Global()
@Module({
    imports: [

        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get<string>('MAIL_HOST'),
                    auth: {
                        user: config.get<string>('MAIL_USER'),
                        pass: config.get<string>('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: 'Apex ' + config.get<string>('SUPPORT_EMAIL'),
                },
                template: {
                    dir: join(__dirname, 'mail', 'templates'),
                    adapter: new HandlebarsAdapter(undefined, { inlineCssEnabled: true }),
                    options: {
                        strict: true,
                    },
                },
                options: {
                    partials: {
                        dir: join(__dirname, 'mail', 'templates', 'partials'),
                        options: {
                            strict: true,
                        },
                    },
                },
            }),
        }),
    ],
    providers: [
        FileDeleteService,
     
        TranslateException,
    
    ],
    exports: [FileDeleteService, TranslateException],
})
export default class UtilModule {}
