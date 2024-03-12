import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CreateServiceDto } from './dto/create-service-dto';
import { Service } from './schemas/services.schema';
import MultipleFieldImagesInterceptor from 'src/common/interceptors/file-upload/multipleFieldImageUpload.interceptor';
import ValidateMultipleFieldImagesTypePipe from 'src/common/pipes/image/validateMultipleFieldImagesType';
import { UpdateServiceDto } from './dto/update-service-dto';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'imageCover', maxCount: 1 },
                { name: 'images', maxCount: 5 },
            ],
            { storage: memoryStorage() },
        ),
        MultipleFieldImagesInterceptor,
    )

    async createNewService(
        @Body() createServiceDto: CreateServiceDto,
        @UploadedFiles(new ValidateMultipleFieldImagesTypePipe(true, ['imageCover', 'images']))
        files: Record<string, Express.Multer.File[]>,
    ): Promise<Service> {
        createServiceDto.imageCover = files['imageCover'][0].path;
        createServiceDto.images = files['images'].map((file) => file.path);
        return await this.servicesService.createService(createServiceDto);
    }


    @Get('')
    async getAllServices(): Promise<{ data: Service[]; count: number }> {
        return await this.servicesService.getServices();
    }


    @Get(':id')
    async getServiceByID(@Param('id') id: string): Promise<Service> {
        return await this.servicesService.getService(id);
    }

    @Put('/:id')

    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'imageCover', maxCount: 1 },
                { name: 'images', maxCount: 5 },
            ],
            { storage: memoryStorage() },
        ),
        MultipleFieldImagesInterceptor,
    )
    async updateServiceById(
        @Param('id') id: string,
        @Body() updateServiceDto: UpdateServiceDto,
        @UploadedFiles(new ValidateMultipleFieldImagesTypePipe(false, ['imageCover', 'images']))
        files: Record<string, Express.Multer.File[]>,
    ) {
        files && files['imageCover'] ? (updateServiceDto.imageCover = files['imageCover'][0].path) : null;
        files && files['images'] ? (updateServiceDto.images = files['images'].map((file) => file.path)) : null;
        return await this.servicesService.updateService(id, updateServiceDto);
    }

    @Delete(':id')

    async deleteServiceById(@Param('id') id: string) {
        return await this.servicesService.deleteService(id);
    }
}
