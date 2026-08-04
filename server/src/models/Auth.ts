export interface AuthenticatedGetRequest extends Request {
  user: {
    id: string | number;
  };
}
export interface AuthenticatedPostRequest extends AuthenticatedGetRequest {
  body: any;
}
