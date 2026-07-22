import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AssetsService } from "./assets.service";
import { CreateAssetDto } from "./dto/create-asset.dto";

/**
 * AssetsController
 * Admin endpoints for managing media assets (models, textures, etc.).
 * TODO: Add @UseGuards(AdminGuard) for production.
 */
@Controller("assets")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.CREATED)
  upload(
    @Body() dto: CreateAssetDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = "admin-user-id";
    return this.assetsService.upload(dto, file, userId);
  }

  @Get()
  findAll(@Query("type") type?: string, @Query("page") page?: string) {
    return this.assetsService.findAll(type, page ? parseInt(page) : 1);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.assetsService.findOne(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.assetsService.remove(id);
  }
}
