import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';

export default async function (app: NestExpressApplication) {
    app.use(helmet());
    app.use(compression());
}
