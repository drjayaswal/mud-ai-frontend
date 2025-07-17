export interface AttachmentFile {
  id: string;
  name: string;
  mime: string;
  url: string;
  size: number;
  created_at: Date;
}
export interface SessionUser {
  user: {
    username: string;
    password: string;
    ucode: string;
  };
  expires: string;
  iat: number;
  exp: number;
}
export interface ResponseInterface {
  success: boolean;
  code: number;
  message: string;
  data: unknown;
}
