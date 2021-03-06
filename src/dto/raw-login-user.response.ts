export type RawLoginUserResponse = {
  user: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    roles: Array<string>;
    signUp: {
      id: string;
      createdAt: string;
      updatedAt: string;
      validateEmail: boolean;
      facebook: string | null;
      gmail: string | null;
    };
  };
  token: {
    expiresIn: number;
    accessToken: string;
  };
};

export const nullRawLoginUserResponse: RawLoginUserResponse = {
  user: {
    id: '',
    createdAt: '2018-09-22T15:00:00.000Z',
    updatedAt: '2018-09-22T15:00:00.000Z',
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    roles: [],
    signUp: {
      id: '',
      createdAt: '2018-09-22T15:00:00.000Z',
      updatedAt: '2018-09-22T15:00:00.000Z',
      validateEmail: true,
      facebook: null,
      gmail: null,
    },
  },
  token: {
    expiresIn: 0,
    accessToken: '',
  },
};
