import request from 'supertest';
import { createApp } from '../../app';
import { Express } from 'express';

describe('Authentication Integration Tests', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createApp();
  });

  describe('User Registration and Login Flow', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'integration@example.com',
      password: 'password123'
    };

    it('should complete full registration and login flow', async () => {
      // Register user
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.email).toBe(userData.email);

      // Login user
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.token).toBeDefined();
    });

    it('should validate registration input', async () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'invalid-email',
        password: '123'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
    });
  });
});