import Redlock from 'redlock';

declare module 'ioredis' {
  interface LockOptions {
    duration?: number;
    unlockListener?: (key: string | string[], lock: Redlock.Lock) => void | Promise<unknown>;
    onAcquisitionError?: (key: string | string[], e: Error) => void | Promise<unknown>;
  }
  interface Redis {
    setKey: Function;
    set: (key: string, value: string | number, ttl?: number) => Promise<unknown>;
    /**
     * @description Locks a given key and executes the given function. If the lock is already acquired, the function will not be executed. The lock will be released after the function is executed. The default lock duration is 10 seconds.
     * @returns  The result of the executed function or false if the lock is already acquired.
     */
    lockdown: <T>(key: string, fn: (lock: Redlock.Lock) => Promise<T> | T, options?: LockOptions) => Promise<T>;
    /**
     * @description Unlocks the given lock or locks. If the lock doesn't exist or is already released, nothing will happen.
     */
    unlock: (lock?: Redlock.Lock | Redlock.Lock[]) => Promise<void>;
    /**
     * @description Gets the value of the given key from the cache. If the key does not exist, the given function will be executed and the value will be set to the key. The default time-to-live is 30 seconds.
     * @param key - The key to get the value from
     * @param fn - The function to execute if the key does not exist
     * @param ttl - The time-to-live for the key
     * @returns The value of the key
     */
    preserve: (key: string, fn: Function, ttl?: number) => Promise<any>;
    /**
     * @description Gets the value of the given key from the cache. If the key does not exist, the given function will be executed and the value will be set to the key. The default time-to-live is 30 seconds.
     * @param key - The key to get the value from
     * @param fn - The function to execute if the key does not exist
     * @param ttl - The time-to-live for the key
     * @returns The value of the key as a JSON object
     */
    preserveJSON: (key: string, fn: Function, ttl?: number) => Promise<any>;
  }
}
