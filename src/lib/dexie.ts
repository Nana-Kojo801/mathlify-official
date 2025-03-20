import { Dexie, EntityTable } from 'dexie'
import { FriendMessage, User } from './types'

export const db = new Dexie('mathlify-official') as Dexie & {
    users: EntityTable<User, '_id'>,
    friends: EntityTable<User, '_id'>,
    friendMessages: EntityTable<FriendMessage, '_id'>
}

db.version(1).stores({
    users: '++_id, _creationTime, username, password, elo, marathon, updatedAt, friends, avatar, isOnline',
    friends: '++_id, _creationTime, username, password, elo, marathon, updatedAt, friends, avatar, isOnline',
    friendMessages: '++_id, senderId, receiverId, message, _creationTime'
})