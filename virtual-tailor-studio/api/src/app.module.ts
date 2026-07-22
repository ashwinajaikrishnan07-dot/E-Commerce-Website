import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { DesignsModule } from "./designs/designs.module";
import { AssetsModule } from "./assets/assets.module";
import { ComponentsModule } from "./components/components.module";

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database
    PrismaModule,

    // Feature modules
    DesignsModule,
    AssetsModule,
    ComponentsModule,
  ],
})
export class AppModule {}
