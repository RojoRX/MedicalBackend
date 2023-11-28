import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'medicaldatabase',
        entities: [
          "src/database/entities/**/*.entity.ts",
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];