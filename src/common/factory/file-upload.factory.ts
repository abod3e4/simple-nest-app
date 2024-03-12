import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join, parse } from 'path';
import { PublicFolderPath } from '../constant';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';

export const fileUploadOption = (folderName: string, mimeTypes: string[]): MulterOptions => ({
    storage: diskStorage({
        destination: (req, file, cb) => {
            const destination = join(PublicFolderPath, 'uploads', folderName);
            if (!existsSync(destination)) mkdirSync(destination, { recursive: true });

            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const ext = parse(file.originalname).ext;

            const fileName = randomUUID() + '.' + file.mimetype.split('/')[1];
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 2129920 },
    fileFilter: (req, file, cb) => {
        if (mimeTypes.includes(file.mimetype)) cb(null, true);
        else cb(new BadRequestException("Can't upload this type of files."), false);
    },
});
