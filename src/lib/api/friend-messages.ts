import { db } from "../dexie"
import { FriendMessage, User } from "../types"

export const getFriendMessages = async (user1: User["_id"], user2: User["_id"]) => {
    return await db.friendMessages.filter(msg => {
        return (msg.senderId === user1 && msg.receiverId === user2) || (msg.senderId === user2 && msg.receiverId === user1)
    }).sortBy("_creationTime")
}

export const addFriendMessage = async (message: FriendMessage) => {
    await db.friendMessages.add(message)
}

export const deleteFriendMessage = async (messageId: FriendMessage["_id"]) => {
    await db.friendMessages.delete(messageId)
}