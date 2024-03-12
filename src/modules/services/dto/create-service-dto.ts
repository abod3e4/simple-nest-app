import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { LanguageDto, LanguageType } from 'src/common';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export class CreateServiceDto {
    @ValidateNested()
    @Type(() => LanguageDto)
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    name: LanguageType;

    @ValidateNested()
    @Type(() => LanguageDto)
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    info: LanguageType;


    imageCover: string;

    images: string[];
}
