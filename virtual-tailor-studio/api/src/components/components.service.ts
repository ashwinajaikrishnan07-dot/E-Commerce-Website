import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

/**
 * ComponentsService
 * Fetches clothing components, textures, colors, and embroidery patterns
 * for the frontend customization interface.
 */
@Injectable()
export class ComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get all clothing components for a specific body part */
  async findByBodyPart(bodyPartName: string, categoryId?: string) {
    const where: any = {
      bodyPart: { name: bodyPartName },
      isActive: true,
    };
    if (categoryId) where.categoryId = categoryId;

    return this.prisma.clothingComponent.findMany({
      where,
      include: {
        category: true,
        defaultMaterial: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  /** Get all available fabric textures */
  async findTextures(categoryId?: string) {
    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;

    return this.prisma.fabricTexture.findMany({
      where,
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  /** Get all color swatches */
  async findColors(category?: string) {
    const where: any = { isActive: true };
    if (category) where.category = category;

    return this.prisma.colorSwatch.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }

  /** Get embroidery patterns for a body part */
  async findEmbroidery(bodyPartName?: string, categoryId?: string) {
    const where: any = { isActive: true };
    if (bodyPartName) where.bodyPart = { name: bodyPartName };
    if (categoryId) where.categoryId = categoryId;

    return this.prisma.embroideryPattern.findMany({
      where,
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  /** Get all body parts */
  async findBodyParts() {
    return this.prisma.bodyPart.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  /** Get all categories */
  async findCategories(parentId?: string) {
    const where: any = { isActive: true };
    if (parentId) where.parentId = parentId;
    else where.parentId = null; // Root categories

    return this.prisma.category.findMany({
      where,
      include: { children: true },
      orderBy: { sortOrder: "asc" },
    });
  }
}
