import { Id } from "@convex/_generated/dataModel";
import { db } from "../dexie";
import { User } from "../types";

export const addUser = async (user: User) => {
    console.log('adding user', user.username);
    
    await db.users.add(user, user._id)
}

export const getUser = async (userId: User["_id"]) => {
    return (await db.users.get(userId))!
}

export const updateUser = async (id: Id<"users">, patch: Partial<User>) => {
    await db.users.update(id, patch)
}