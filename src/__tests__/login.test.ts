import nock from 'nock';

import { login } from './../login';
import mockSignUp from './signup.json';
import mockUser from './user.json';

// console.error = jest.fn();

describe('login', () => {
  it('should return expected data when request succeed', async () => {
    nock('http://localhost:80')
      .post('/auth/login')
      .reply(200, {
        user: {
          ...mockUser,
          signUp: mockSignUp,
        },
        token: {
          expiresIn: 24 * 60 * 60,
          accessToken: 'access-token',
        },
      });

    const response = await login({ email: 'john.doe@company.com', password: 'password' });
    expect(response.token).toBe('access-token');
    expect(response.user).toEqual(mockUser);
  });

  it('should return data with default date if property is missing', async () => {
    console.error = jest.fn();
    const { createdAt, ...user } = mockUser;
    nock('http://localhost:80')
      .post('/auth/login')
      .reply(200, {
        user: {
          ...user,
          signUp: mockSignUp,
        },
        token: {
          expiresIn: 24 * 60 * 60,
          accessToken: 'access-token',
        },
      });

    const response = await login({ email: 'john.doe@company.com', password: 'password' });
    expect(console.error).toHaveBeenCalledWith([
      {
        dataPath: '.user',
        keyword: 'required',
        message: "should have required property 'createdAt'",
        params: { missingProperty: 'createdAt' },
        schemaPath: '#/properties/user/required',
      },
    ]);
    expect(response.token).toBe('access-token');
    expect(response.user).toEqual(mockUser);
  });

  it('should throw app.error.bad-password when request fails with status UNAUTHORIZED', () => {
    nock('http://localhost:80').post('/auth/login').reply(401);

    return expect(login({ email: 'john.doe@company.com', password: 'password' })).rejects.toEqual(new Error('error.bad-password'));
  });

  it('should throw app.error.unknown otherwise', () => {
    nock('http://localhost:80').post('/auth/login').reply(500);

    return expect(login({ email: 'john.doe@company.com', password: 'password' })).rejects.toEqual(new Error('error.unknown'));
  });
});
