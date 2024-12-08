import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync({
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
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
