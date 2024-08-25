"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
exports.databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (configService) => {
            const options = {
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            };
            return (0, typeorm_1.createConnection)(options);
        },
        inject: [config_1.ConfigService],
    },
];
