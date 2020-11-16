import { UserType } from '../types/User';

export type LoginUserRequestDto = {
  token: string;
  user: UserType;
};
