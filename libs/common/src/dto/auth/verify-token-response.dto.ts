import { ValidatedUser } from '@app/common/types';
import { JwtPayload } from './jwt-payload.dto';

export interface VerifyTokenResponseDto {
  valid: boolean;
  user: ValidatedUser;
  payload: JwtPayload;
}
