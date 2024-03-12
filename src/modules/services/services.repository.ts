import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Service } from './schemas/services.schema';
import { EntityRepository } from 'src/common';

@Injectable()
export class ServicesRepository extends EntityRepository<Service> {
  constructor(@InjectModel(Service.name) serviceModel: Model<Service>) {
    super(serviceModel);
  }
}
