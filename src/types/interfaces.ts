export interface IEnvCustom extends NodeJS.ProcessEnv {
    NODE_ENV: "development" | "production";
    DATABASE: string;
    MAIL_USER: string;
    MAIL_PASS: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    PORT: string;
    MAP_KEY: string;
    SECRET: string;
    KEY: string;
}
