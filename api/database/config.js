import config from 'dotenv'

config.config()

//the default env is production, which for heroku
let env = process.env.NODE_ENV || 'development';
console.log('env *******', env);


export const dbconn = () => {

  let conn;

  if(env === 'development'){
    conn = process.env.DEV_MONGO_URI //using local
  }

  if(env === 'test'){
    conn = process.env.TEST_MONGO_URI //using test
  }

  return conn

}


