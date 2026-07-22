import { Controller, Get, Param, Query } from "@nestjs/common";
import { ComponentsService } from "./components.service";

/**
 * ComponentsController
 * Public API endpoints for browsing available customization options.
 */
@Controller("components")
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get("body-parts")
  getBodyParts() {
    return this.componentsService.findBodyParts();
  }

  @Get("categories")
  getCategories(@Query("parentId") parentId?: string) {
    return this.componentsService.findCategories(parentId);
  }

  @Get("by-body-part/:bodyPart")
  getByBodyPart(
    @Param("bodyPart") bodyPart: string,
    @Query("categoryId") categoryId?: string
  ) {
    return this.componentsService.findByBodyPart(bodyPart, categoryId);
  }

  @Get("textures")
  getTextures(@Query("categoryId") categoryId?: string) {
    return this.componentsService.findTextures(categoryId);
  }

  @Get("colors")
  getColors(@Query("category") category?: string) {
    return this.componentsService.findColors(category);
  }

  @Get("embroidery")
  getEmbroidery(
    @Query("bodyPart") bodyPart?: string,
    @Query("categoryId") categoryId?: string
  ) {
    return this.componentsService.findEmbroidery(bodyPart, categoryId);
  }
}
