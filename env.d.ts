// File with typings for which environment variables we expect to exist in our .env-file

declare module "@env" {
  const API_KEY: string;
  const AUTH_DOMAIN: string;
  const DATABASE_URL: string;
  const PROJECT_ID: string;
  const STORAGE_BUCKET: string;
  const MESSAGE_SENDER_ID: string;
  const APP_ID: string;
}
