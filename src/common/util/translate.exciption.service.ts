import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nPath, I18nTranslations } from 'src/locales/generated/i18n.generated';

@Injectable()
export class TranslateException {
    constructor(private readonly i18n: I18nService) {}

    I18nNotFoundException(name: string) {
        const message = this.i18n.t('error.NOT_FOUND', {
            lang: I18nContext.current().lang,
            args: { name },
        });
        throw new NotFoundException(message);
    }

    I18nBadRequestException(errorMessage: PathImpl2<I18nTranslations>) {
        const message = this.i18n.t(errorMessage, {
            lang: I18nContext.current().lang,
        });
        throw new BadRequestException(message);
    }

    I18nUnauthorizedException() {
        const message = this.i18n.t<I18nPath>('error.UNAUTHORIZED', {
            lang: I18nContext.current().lang,
        });
        throw new ForbiddenException([message]);
    }

    I18nBlacklistMessageBan(hours: string) {
        const message = this.i18n.t<I18nPath>('error.BLACKLIST', {
            lang: I18nContext.current().lang,
            args: { hours },
        });
        throw new BadRequestException(message);
    }
}
