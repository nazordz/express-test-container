import dotenv from "dotenv";
dotenv.config();

export function getEnv(key: string, defaultValue?: string) {
  const value = process.env[key];
  if (value == undefined) {
    if (defaultValue) {
      return defaultValue;
    } else {
      throw new Error(`${key} haven't declared`);
    }
  }
  return value;
}
