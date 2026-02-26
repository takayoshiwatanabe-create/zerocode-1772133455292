import { describe, it, expect } from '@jest/globals';

// We don't have direct runtime tests for types,
// but we can ensure they are correctly defined and exported.
// This is more of a compile-time check, but a simple test file
// can confirm the types exist and are accessible.

describe('Type Definitions', () => {
  it('should have Id type defined', () => {
    // This is a compile-time check. If Id was not exported or defined,
    // TypeScript would complain here. At runtime, 'Id' is just 'string'.
    type TestId = Id;
    const myId: TestId = 'some-unique-id';
    expect(myId).toBe('some-unique-id');
  });

  it('should have User type defined', () => {
    const user: User = {
      id: 'user-123',
      email: 'test@example.com',
      nickname: 'TestUser',
      role: 'child',
    };
    expect(user.id).toBe('user-123');
    expect(user.email).toBe('test@example.com');
    expect(user.nickname).toBe('TestUser');
    expect(user.role).toBe('child');
  });

  it('should have ChatMessage type defined', () => {
    const message: ChatMessage = {
      id: 'msg-1',
      senderId: 'user-1',
      recipientId: 'user-2',
      phraseKey: 'chat_phrase_hello',
      timestamp: Date.now(),
    };
    expect(message.id).toBe('msg-1');
    expect(message.senderId).toBe('user-1');
    expect(message.recipientId).toBe('user-2');
    expect(message.phraseKey).toBe('chat_phrase_hello');
    expect(typeof message.timestamp).toBe('number');
  });

  it('should have WorldLocation type defined', () => {
    const location: WorldLocation = {
      id: 'loc-1',
      nameKey: 'location_home_village',
      descriptionKey: 'location_home_village_desc',
      coordinates: { x: 10, y: 20 },
      jobsAvailable: ['farmer', 'baker'],
    };
    expect(location.id).toBe('loc-1');
    expect(location.nameKey).toBe('location_home_village');
    expect(location.descriptionKey).toBe('location_home_village_desc');
    expect(location.coordinates.x).toBe(10);
    expect(location.coordinates.y).toBe(20);
    expect(location.jobsAvailable).toEqual(['farmer', 'baker']);
  });

  it('should have Coordinates type defined', () => {
    const coords: Coordinates = { x: 100, y: 200 };
    expect(coords.x).toBe(100);
    expect(coords.y).toBe(200);
  });
});

// Import types to ensure they are recognized by TypeScript
import { Id, User, ChatMessage, WorldLocation, Coordinates } from './types';
