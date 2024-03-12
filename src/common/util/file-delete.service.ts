import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { PublicFolderPath } from '../constant';

@Injectable()
export default class FileDeleteService {
    async deleteSingleFile(file: Express.Multer.File) {
        try {
            file.path ? await this.deleteFile(file.path) : null;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deleteSinglePath(path: string) {
        try {
            await this.deleteFile(path);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deleteMultipleFieldFile(files: Record<string, Express.Multer.File[]>) {
        try {
            for (let field of Object.keys(files)) {
                await Promise.all(
                    files[field].map(async (file) => (file.path ? await this.deleteFile(file.path) : null)),
                );
            }
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    async deleteMultiplePaths(paths: string[]) {
        try {
            for (let path of paths) await this.deleteFile(path);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deleteMultipleFiles(files: Express.Multer.File[]) {
        try {
            await Promise.all(files.map(async (file) => (file.path ? await this.deleteFile(file.path) : null)));
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    private deleteFile(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.unlink(join(PublicFolderPath, 'uploads', path), (err) => {
                if (err) reject("Can't delete file.");

                resolve('File deleted successfully.');
            });
        });
    }
}
