import { db } from "../dexie";
import { User } from "../types";

export const addFriend = async (friend: User) => {
    await db.friends.add(friend, friend._id)
}

export const getFriends = async () => {
    return await db.friends.toArray()
}

export const getFriend = async (friendId: User["_id"]) => {
    return (await db.friends.get(friendId))!
}

export const refereshFriends = async (friends: User[]) => {
    await db.friends.bulkDelete(friends.map(friend => friend._id))
    await db.friends.bulkAdd(friends)
}
