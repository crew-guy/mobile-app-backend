import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { getConnectionOptions } from 'typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ReportModule } from './report/report.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      port: 27017,
      url: 'mongodb+srv://medivaulter:medivaulter@cluster0.rzbuf.mongodb.net/medivaultdb',
      useNewUrlParser: true,
      keepConnectionAlive: true,
      // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ReportModule,
    AppointmentModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      // isGlobal: true,
    }),
    PatientModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
