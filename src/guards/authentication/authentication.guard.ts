import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import { AppConfigService } from '../../config/app-config.service';
import { DecodedAccessTokenDto } from './dto/decoded-access-token.dto';
import { AppLogger } from '../../core/logger/logger';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly TOKEN_PREFIX_LENGTH: number = 7;

  constructor(
    private readonly configService: AppConfigService,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request && request.headers && request.headers.authorization) {
      const cleanJwt = request.headers.authorization.slice(
        AuthenticationGuard.TOKEN_PREFIX_LENGTH,
        request.headers.authorization.length
      );
      const decodedToken: DecodedAccessTokenDto = await this.validateRequest(
        cleanJwt
      );
      if (decodedToken) {
        request.token = decodedToken;
        return true;
      }
    }
    throw new UnauthorizedException();
  }

  private async validateRequest(token: string): Promise<DecodedAccessTokenDto> {
    try {
      this.appLogger.debug('validate authentication request');
      const decodedToken: DecodedAccessTokenDto = await this.verifyJWT(token);
      if (!decodedToken) {
        return null;
      }
      return decodedToken;
    } catch (error) {
      this.appLogger.error(`Failed to validate request, error: ${error}`);
      return null;
    }
  }

  private async verifyJWT(token: string): Promise<DecodedAccessTokenDto> {
    // Todo - Replace with your own logic
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(
        token,
        '-----BEGIN PUBLIC KEY----------END PUBLIC KEY-----',
        (error, decoded: DecodedAccessTokenDto) => {
          if (error) {
            this.appLogger.error(error.message);
            reject();
          }
          resolve(decoded);
        }
      );
    });
  }
}
