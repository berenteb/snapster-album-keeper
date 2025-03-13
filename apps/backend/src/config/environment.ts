import * as dotenv from "dotenv";
import * as env from "env-var";

dotenv.config();

const environment = () => ({
  port: env.get("BACKEND_PORT").required().asPortNumber(),
  jwtSecret: env.get("JWT_SECRET").required().asString(),
  cookieDomain: env.get("COOKIE_DOMAIN").required().asString(),
  frontendUrl: env.get("FRONTEND_URL").required().asString(),
  googleClientId: env.get("GOOGLE_CLIENT_ID").required().asString(),
  googleClientSecret: env.get("GOOGLE_CLIENT_SECRET").required().asString(),
  salt: env.get("SALT").required().asIntPositive(),
  minio: {
    endPoint: env.get("STORAGE_ENDPOINT").required().asString(),
    port: env.get("STORAGE_PORT").required().asPortNumber(),
    accessKey: env.get("STORAGE_ACCESS_KEY").required().asString(),
    secretKey: env.get("STORAGE_SECRET_KEY").required().asString(),
    defaultBucket: env
      .get("STORAGE_DEFAULT_BUCKET")
      .default("default")
      .asString(),
    useSSL: env.get("STORAGE_USE_SSL").default("false").asBool(),
  },
  upload: {
    maxFileSize: env
      .get("UPLOAD_MAX_FILE_SIZE")
      .default("5248000")
      .asIntPositive(),
  },
});

export default environment;

export type Environment = ReturnType<typeof environment>;
