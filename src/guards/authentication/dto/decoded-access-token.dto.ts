export class DecodedAccessTokenDto {
  sub: string;

  iss: string;

  first_name: string;

  last_name: string;

  email: string;

  scope: string[];

  iat: number;

  exp: number;
}
