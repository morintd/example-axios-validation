import Ajv from 'ajv';

import { api, globalApiErrorHandler } from './api';
import { LoginUserRequestDto } from './dto/login-user.request.dto';
import { nullRawLoginUserResponse, RawLoginUserResponse } from './dto/raw-login-user.response';
import rawLoginUserResponseJsc from './dto/schema/raw-login-user-response.jsc';
import { UserToLoginDto } from './dto/user-to-login.dto';

const ajv = new Ajv();
const validate= ajv.compile(rawLoginUserResponseJsc);

export async function login({ email, password }: UserToLoginDto): Promise<LoginUserRequestDto> {
  return api
    .post<RawLoginUserResponse>('/auth/login', { email, password }, { validate, nullRawData: nullRawLoginUserResponse })
    .then((response) => {
      const { signUp, createdAt, ...user } = response.data.user;
      return {
        user: {
          ...user,
          createdAt: new Date(createdAt).toISOString(),
        },
        token: response.data.token.accessToken,
      };
    })
    .catch((e) => {
      if (e.response.status === 401) throw new Error('error.bad-password');
      else throw e;
    })
    .catch(globalApiErrorHandler);
}
