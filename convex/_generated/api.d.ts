/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as friendMessages from "../friendMessages.js";
import type * as migrations_init_game_state from "../migrations/init_game_state.js";
import type * as requests from "../requests.js";
import type * as roomMessages from "../roomMessages.js";
import type * as rooms from "../rooms.js";
import type * as types from "../types.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  friendMessages: typeof friendMessages;
  "migrations/init_game_state": typeof migrations_init_game_state;
  requests: typeof requests;
  roomMessages: typeof roomMessages;
  rooms: typeof rooms;
  types: typeof types;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
