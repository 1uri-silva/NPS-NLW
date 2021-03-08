import { Connection, createConnection, getConnectionOptions } from "typeorm";


export default async (): Promise<Connection> => {
  const defaultOpt = await getConnectionOptions()

 return createConnection(
   Object.assign(defaultOpt, {
     database:process.env.NODE_ENV === 'test'
     ? "src/database/nlw.sqlite"
     : defaultOpt.database,

   })

   );
  };
  // console.log('Database is connected')


// then(() => console.log('Database is connected...'));