import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { allowedImageSize } from 'src/common/constant';

@Injectable()
export default class ValidateImageTypePipe implements PipeTransform {
    private whitelist = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];
    constructor(private isRequired: boolean) {
        this.isRequired = isRequired;
    }

    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!file && this.isRequired) throw new BadRequestException('Image is required.');
        if (!file && !this.isRequired) return;
        if (file.size > allowedImageSize)
            throw new BadRequestException(`Image size bigger than the allowed size, allowed size is 20mb`);
        if (!this.whitelist.includes(file.mimetype)) throw new BadRequestException('File must be image file');

        return file;
    }
}
