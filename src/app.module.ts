import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { ArticlesModule } from "./articles/articles.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { LangchainModule } from "./langchain/langchain.module";

@Module({
  imports: [
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
    LangchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
