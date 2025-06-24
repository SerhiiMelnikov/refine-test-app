export interface IAuthenticatedUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
