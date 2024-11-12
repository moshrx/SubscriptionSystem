const redis = require('redis');

// Configure the Redis client
const client = redis.createClient({
    host: '127.0.0.1', // Default Redis host
    port: 6379,        // Default Redis port
    // password: 'your_password_if_needed' // Uncomment and set if using password
});

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Connect to Redis
(async () => {
    await client.connect(); // Use async connection if using Redis 4.x+
})();

module.exports = client;
