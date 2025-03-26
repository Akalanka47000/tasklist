import { Priority, RecurringInterval } from '@shared/constants';
import { default as request } from 'supertest';
import { app } from '@/app';
import { faker } from '@faker-js/faker';
import { registerUser, sessionCookie } from '../../../../../__utils__';

describe('tasks', () => {
  beforeAll(async () => {
    await registerUser(app);
  });
  test('should successfully fetch tasks for the first time initializing a session', async () => {
    const res = await request(app).get('/api/v1/tasks?page=1');
    expect(res.status).toBe(200);
    expect(res.body.data.docs).toHaveLength(0);
    expect(res.body.data.totalDocs).toBe(0);
    expect(res.body.data.limit).toBe(10);
    expect(res.body.data.hasNextPage).toBe(false);
    expect(res.headers['set-cookie'][0]).toContain('access_token');
    expect(res.headers['set-cookie'][1]).toContain('refresh_token');
  });
  describe('should create read update and delete tasks', () => {
    let newlyCreatedTask: ITask;
    test('should create a new task', async () => {
      const payload = {
        title: faker.lorem.sentence(),
        priority: Priority.Low
      };
      const res = await request(app)
        .post('/api/v1/tasks')
        .send(payload)
        .set('Cookie', await sessionCookie(app));
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data._id).toBeDefined();
      newlyCreatedTask = res.body.data;
    });
    test('should fetch a task by id', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${newlyCreatedTask._id}`)
        .set('Cookie', await sessionCookie(app));
      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject(newlyCreatedTask);
    });
    test('should delete a task by id', async () => {
      let res = await request(app)
        .delete(`/api/v1/tasks/${newlyCreatedTask._id}`)
        .set('Cookie', await sessionCookie(app));
      expect(res.status).toBe(200);
      res = await request(app)
        .get(`/api/v1/tasks/${newlyCreatedTask._id}`)
        .set('Cookie', await sessionCookie(app));
      expect(res.status).toBe(404);
    });
  });
  describe('should fetch a list of tasks', () => {
    const tasks = Array.from({ length: 20 }, (_) => ({
      title: faker.lorem.sentence(),
      priority: faker.helpers.arrayElement(Object.values(Priority).filter(Number)),
      recurring_interval: faker.helpers.arrayElement(Object.values(RecurringInterval))
    }));
    beforeAll(async () => {
      await Promise.all(
        tasks.map(async (t) => {
          return request(app)
            .post('/api/v1/tasks')
            .send(t)
            .set('Cookie', await sessionCookie(app));
        })
      );
    });
    test('should fetch tasks in pages of 5 ordered by created date at top', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?page=1&limit=5')
        .set('Cookie', await sessionCookie(app));
      expect(res.status).toBe(200);
      expect(res.body.data.docs).toHaveLength(5);
      expect(res.body.data.totalDocs).toBe(tasks.length);
      expect(res.body.data.limit).toBe(5);
      expect(res.body.data.hasNextPage).toBe(true);
    });
  });
});
