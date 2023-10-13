
import { createClient } from 'redis';

// function to store 

let redisClient: any = null;

async function createRedisClient() {


   redisClient = createClient();
   redisClient.on('error', err => { 
      redisClient = null;
    
   });
   
   await redisClient.connect();
   redisClient.on('ready', () => {
      console.log('Redis Client Connected');
   });
}


export { createRedisClient, redisClient };
