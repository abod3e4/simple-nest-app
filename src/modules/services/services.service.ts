import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { CreateServiceDto } from './dto/create-service-dto';
import { UpdateServiceDto } from './dto/update-service-dto';
import FileDeleteService from 'src/common/util/file-delete.service';
import { Service } from './schemas/services.schema';

@Injectable()
export class ServicesService {
    constructor(
        private readonly servicesRepository: ServicesRepository,
        private readonly fileDeleteService: FileDeleteService,

    ) {}

    async createService({ ...createServiceDto }: CreateServiceDto) {
        const service = await this.servicesRepository.create(createServiceDto);

        const localizedService = this.servicesRepository.localized(service) as Service;
        return localizedService;
    }

    async getService(id: string) {
        let service = await this.servicesRepository.findOne({ _id: id });
        if (!service) throw new NotFoundException('Service not found.');

        const localizedService = this.servicesRepository.localized(service) as Service;
        return localizedService;
    }

    async getServices() {
        const result = await this.servicesRepository.findWithPagination({
            filterQuery: {},
            option: {},
        });

        const localizedService = this.servicesRepository.localized(result.data);

        result.data = localizedService as Service[];

        return result;
    }

    async updateService(id: string, updateServiceDto: UpdateServiceDto) {
        let service = await this.servicesRepository.findOne({ _id: id });
        service.imageCover && updateServiceDto.imageCover
            ? this.fileDeleteService.deleteSinglePath(service.imageCover)
            : null;
        service.images.length > 0 && updateServiceDto.images
            ? this.fileDeleteService.deleteMultiplePaths(service.images)
            : null;
        const updatedService = await this.servicesRepository.findOneAndUpdate({ _id: id }, updateServiceDto);

        const localizedService = this.servicesRepository.localized(updatedService);
        return localizedService;
    }

    async deleteService(id: string) {
        let service = await this.servicesRepository.findOne({ _id: id });
        service.imageCover ? this.fileDeleteService.deleteSinglePath(service.imageCover) : null;

        service.images && service.images.length > 0 ? this.fileDeleteService.deleteMultiplePaths(service.images) : null;
        await this.servicesRepository.deleteMany({ _id: id });
        return 'Deleted successfully';
    }
}
