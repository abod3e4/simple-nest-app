import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './schemas/services.schema';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';
import { FOLDER_TOKEN, locales } from 'src/common/constant';
import * as mongooseLocalize from 'mongoose-i18n-localize';
import UtilModule from 'src/common/util/util.module';

@Module({
    imports: [
        UtilModule,
        MongooseModule.forFeatureAsync([
            {
                name: Service.name,
                useFactory: () => {
                    const schema = ServiceSchema;
                    schema.plugin(mongooseLocalize, locales);
                    return schema;
                },
            },
        ]),
    ],
    providers: [ServicesService, ServicesRepository, { provide: FOLDER_TOKEN, useValue: 'services' }],
    controllers: [ServicesController],
    exports: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
