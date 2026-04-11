import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

let redis = null;

// FIX: lazyConnect:true requires explicit .connect() — was never called before
// Wrap in try-catch so missing Redis doesn't crash the process
if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
  connectTimeout: 3000,
  commandTimeout: 2000,
  enableOfflineQueue: false,
  retryStrategy: () => null, // 🔥 stops reconnect spam
});

    // FIX: actually call connect() when lazyConnect is true
    await redis.connect().catch((err) => {
      console.warn('[Redis] Could not connect, cache disabled:', err.message);
      redis = null;
    });

    if (redis) {
      redis.on('error', (e) => console.warn('[Redis] Runtime error:', e.message));
      console.log('[Redis] Connection healthy');
    }
  } catch (err) {
    console.warn('[Redis] Init failed, cache disabled:', err.message);
    redis = null;
  }
} else {
  console.log('[Redis] REDIS_URL not set — running without cache');
}

export async function cacheGet(key) {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (err) {
    // FIX: was silently swallowed — now logged at debug level
    console.warn('[Redis] cacheGet failed:', key, err.message);
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = 300) {
  if (!redis) return;
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch (err) {
    console.warn('[Redis] cacheSet failed:', key, err.message);
  }
}

export async function cacheDel(key) {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn('[Redis] cacheDel failed:', key, err.message);
  }
}

export const isRedisAvailable = () => redis !== null;