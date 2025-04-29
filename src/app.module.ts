import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { OrdersModule } from "./orders/orders.module";
import { User } from "./users/entities/user.entity";
import { Order } from "./orders/entities/order.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Pastikan ConfigModule bisa diakses global
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST"),
        port: parseInt(configService.get<string>("POSTGRES_PORT") || "5432", 10),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DATABASE"),
        entities: [User, Order],
        synchronize: configService.get<string>("NODE_ENV") !== "production",
        ssl: {
          rejectUnauthorized: false,
        },
        keepConnectionAlive: true,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
  ],
})
export class AppModule {}
