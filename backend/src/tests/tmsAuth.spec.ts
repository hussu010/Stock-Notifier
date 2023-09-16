import { connect, clear, close } from './test-db-connect.helper';

import request from 'supertest';
import app from '../../index';

import { seedTmsAuth } from './tmsAuth.helper';

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe('GET /tms-auth', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/tms-auth');
    expect(res.status).toBe(200);
  });

  it('should return null if tmsAuth object does not exists', async () => {
    const res = await request(app).get('/tms-auth');
    expect(res.body).toBe(null);
  });

  it('should return tmsAuth object if exists', async () => {
    const tmsAuth = await seedTmsAuth();

    const res = await request(app).get('/tms-auth');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('xsrfToken');
    expect(res.body.xsrfToken).toBe(tmsAuth.xsrfToken);
    expect(res.body).toHaveProperty('_aid');
    expect(res.body._aid).toBe(tmsAuth._aid);
    expect(res.body).toHaveProperty('_rid');
    expect(res.body._rid).toBe(tmsAuth._rid);
  });
});

describe('PATCH /tms-auth', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).patch('/tms-auth');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: '_aid',
            location: 'body',
          }),
          expect.objectContaining({
            path: '_rid',
            location: 'body',
          }),
          expect.objectContaining({
            path: 'xsrfToken',
            location: 'body',
          }),
        ]),
      })
    );
  });

  it('should return a tmsAuth object', async () => {
    const res = await request(app).patch('/tms-auth').send({
      _aid: '5f6a9f7b0a5c6f0017a7d8a4',
      _rid: '5f6a9f7b0a5c6f0017a7d8a5',
      xsrfToken: 'xsrfToken',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('xsrfToken');
    expect(res.body.xsrfToken).toBe('xsrfToken');
    expect(res.body).toHaveProperty('_aid');
    expect(res.body._aid).toBe('5f6a9f7b0a5c6f0017a7d8a4');
    expect(res.body).toHaveProperty('_rid');
    expect(res.body._rid).toBe('5f6a9f7b0a5c6f0017a7d8a5');
  });
});
