import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

const DBConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: DBConfig.type,
    host: process.env.RDS_HOST || DBConfig.host,
    port: process.env.RDS_PORT || DBConfig.port,
    username: process.env.RDS_USERNAME || DBConfig.username,
    password: process.env.RDS_PASSWORD || DBConfig.password,
    database: process.env.RDS_DB_NAME || DBConfig.database,
    entities: [__dirname + '/../**/*.entity.{ts, js}'],
    // entities: ['dist/tasks/entity*.entity.{js,ts}'],
    synchronize: process.env.TYPEORM_SYNC || DBConfig.synchronize,
    autoLoadEntities: true,
    // logging: true,
    // subscribers: [],
    // migrations: [],
}