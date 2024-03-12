import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export default class ValidateMultipleImagesTypePipe implements PipeTransform {
    private whitelist = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];
    constructor(private isRequired: boolean) {
        this.isRequired = isRequired;
    }
    transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
        if (this.isRequired && files.length == 0) throw new BadRequestException('Images is required.');

        for (let file of files) {
            if (!this.whitelist.includes(file.mimetype)) throw new BadRequestException('File must be image file');
        }

        return files;
    }
}
