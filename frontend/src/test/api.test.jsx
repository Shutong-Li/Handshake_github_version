/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { client, login, registerUser, checkVerification, setNavigate, getNavigate } from '../jsx_files/api';

vi.mock('../jsx_files/api', async () => {
  const actual = await vi.importActual('../jsx_files/api');
  return {
    ...actual,
    client: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('login', () => {
    it('should throw an error if login fails', async () => {
      const mockError = new Error('Network Error');
      client.post.mockRejectedValueOnce(mockError);

      await expect(login('test@example.com', 'password123')).rejects.toThrow('Network Error');
    });
  });

  describe('registerUser', () => {
    it('should throw an error if registration fails', async () => {
      const mockError = new Error('Registration Failed');
      client.post.mockRejectedValueOnce(mockError);
      const userData = {
        username: 'test@example.com',
        password: 'password123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      await expect(registerUser(userData)).rejects.toThrow('Network Error');
    });
  });

  describe('checkVerification', () => {
    it('should throw an error if verification check fails', async () => {
      const mockError = new Error('Verification Check Failed');
      client.get.mockRejectedValueOnce(mockError);
      await expect(checkVerification('test@example.com')).rejects.toThrow('Network Error');
    });
  });

  describe('navigate helpers', () => {
    it('should set and get the navigate function', () => {
      const mockNavigate = vi.fn();
      setNavigate(mockNavigate);
      const navigate = getNavigate();
      expect(navigate).toBe(mockNavigate);
    });

    it('should throw an error if navigate function is not set', () => {
      setNavigate(null);
      expect(() => getNavigate()).toThrow('Navigate function is not set.');
    });
  });
});