import Ajv from 'ajv';
import axios from 'axios';
import deepmerge from 'deepmerge';

declare module 'axios' {
  export interface AxiosRequestConfig {
    validate?: Ajv.ValidateFunction;
    nullRawData?: Object;
  }
}

export const api = axios.create({
  baseURL: 'http://localhost:80',
});

api.interceptors.response.use(async (response) => {
  const { validate } = response.config;
  if (validate) {
    const isValid = await validate(response.data);
    if (!isValid) {
      const { errors } = validate;
      console.error(errors);
      if (response.config.nullRawData) {
        const data = deepmerge(response.config.nullRawData, response.data);
        return { ...response, data };
      }
    }
  }
  return response;
});

export function globalApiErrorHandler(error: Error): never {
  if (error.message.startsWith('error.')) throw error;
  else {
    console.error(error);
    throw new Error('error.unknown');
  }
}
