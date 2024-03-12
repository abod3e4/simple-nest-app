import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LanguageDto } from 'src/common';

@Schema({
    timestamps: true,
})
export class Service extends Document {
    @Prop({ i18n: true })
    name: LanguageDto;

    @Prop({ i18n: true })
    info: LanguageDto;

    @Prop()
    imageCover: string;

    @Prop()
    images: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
