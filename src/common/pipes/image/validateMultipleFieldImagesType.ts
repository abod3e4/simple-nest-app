import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export default class ValidateMultipleFieldImagesTypePipe implements PipeTransform {
    private whitelist = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];
    constructor(
        private isRequired: boolean,
        private fieldsName: string[],
    ) {
        this.isRequired = isRequired;
    }
    transform(files: Record<string, Express.Multer.File[]>, metadata: ArgumentMetadata) {
        if (this.isRequired && Object.keys(files).length == 0) throw new BadRequestException('Images is required.');
        if (this.isRequired && Object.keys(files).length !== this.fieldsName.length)
            throw new BadRequestException(`All ${this.fieldsName.join(' , ')} are required.`);

        for (let field of Object.keys(files)) {
            for (let file of files[field]) {
                if (!this.whitelist.includes(file.mimetype)) throw new BadRequestException('File must be image file');
            }
        }

        return files;
    }
}
