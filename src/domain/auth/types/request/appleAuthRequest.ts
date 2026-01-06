export interface AppleAuthRequest {
  identityToken: string;
  authorizationCode: string;
  name: string | null;
}
