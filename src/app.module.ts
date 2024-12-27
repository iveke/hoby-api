import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HobbyModule } from './hobby/hobby.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ChallangeModule } from './challange/challange.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'iveketkach05',
        database: 'hobby',
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    HobbyModule,
    ReviewsModule,
    ChallangeModule,
  ],
  providers: [],
})
export class AppModule {}
