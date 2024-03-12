import { HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join, parse, resolve } from 'path';
import * as sharp from 'sharp';
import { PublicFolderPath } from '../constant';

export const uploadImage = async (file: Express.Multer.File, folderName: string) => {
    const purePath = join(PublicFolderPath, 'uploads');
    const fileName = `${randomUUID()}-${Math.random() * 9999999}.webp`;

    const destination = join(purePath, folderName);
    if (!existsSync(destination)) mkdirSync(destination, { recursive: true });

    try {
        await sharp(file.buffer).webp({ quality: 90 }).toFile(join(destination, fileName));
        file.path = `${folderName}/${fileName}`;
    } catch (err) {
        throw new HttpException(err, 400, { cause: new Error('Error while processing the image.') });
    }

    return file;
};
