import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { DesignsService } from "./designs.service";
import { CreateDesignDto } from "./dto/create-design.dto";
import { UpdateDesignDto } from "./dto/update-design.dto";

/**
 * DesignsController
 * REST API endpoints for design project management.
 * TODO: Add @UseGuards(AuthGuard) for production.
 */
@Controller("designs")
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDesignDto) {
    // TODO: Extract userId from JWT token
    const userId = "demo-user-id";
    return this.designsService.create(userId, dto);
  }

  @Get()
  findAll(@Query("page") page?: string, @Query("pageSize") pageSize?: string) {
    const userId = "demo-user-id";
    return this.designsService.findAll(
      userId,
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 20
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    const userId = "demo-user-id";
    return this.designsService.findOne(id, userId);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDesignDto) {
    const userId = "demo-user-id";
    return this.designsService.update(id, userId, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    const userId = "demo-user-id";
    return this.designsService.remove(id, userId);
  }

  @Post(":id/duplicate")
  duplicate(@Param("id") id: string) {
    const userId = "demo-user-id";
    return this.designsService.duplicate(id, userId);
  }

  @Post(":id/favorite")
  toggleFavorite(@Param("id") id: string) {
    const userId = "demo-user-id";
    return this.designsService.toggleFavorite(id, userId);
  }
}
