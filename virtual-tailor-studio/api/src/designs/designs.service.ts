import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDesignDto } from "./dto/create-design.dto";
import { UpdateDesignDto } from "./dto/update-design.dto";

/**
 * DesignsService
 * Business logic for design project CRUD operations.
 */
@Injectable()
export class DesignsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDesignDto) {
    const project = await this.prisma.designProject.create({
      data: {
        name: dto.name,
        userId,
        garmentCategory: dto.garmentCategory,
        isPublic: dto.isPublic ?? false,
        components: dto.components
          ? {
              create: dto.components.map((comp) => ({
                bodyRegion: comp.bodyRegion,
                componentId: comp.componentId,
                textureId: comp.textureId,
                colorId: comp.colorId,
                embroideryId: comp.embroideryId,
                embroideryColor: comp.embroideryColor,
                materialOverrides: (comp.materialOverrides as any) ?? undefined,
              })),
            }
          : undefined,
      },
      include: { components: true },
    });

    return project;
  }

  async findAll(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [projects, total] = await Promise.all([
      this.prisma.designProject.findMany({
        where: { userId },
        include: { components: true },
        orderBy: { updatedAt: "desc" },
        skip,
        take: pageSize,
      }),
      this.prisma.designProject.count({ where: { userId } }),
    ]);

    return {
      data: projects,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.designProject.findFirst({
      where: { id, userId },
      include: {
        components: {
          include: {
            component: true,
            texture: true,
            color: true,
            embroidery: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Design project ${id} not found`);
    }

    return project;
  }

  async update(id: string, userId: string, dto: UpdateDesignDto) {
    // Verify ownership
    await this.findOne(id, userId);

    const project = await this.prisma.designProject.update({
      where: { id },
      data: {
        name: dto.name,
        garmentCategory: dto.garmentCategory,
        isPublic: dto.isPublic,
      },
      include: { components: true },
    });

    // Update components if provided
    if (dto.components) {
      // Delete existing and recreate (upsert pattern)
      await this.prisma.designComponent.deleteMany({
        where: { projectId: id },
      });

      await this.prisma.designComponent.createMany({
        data: dto.components.map((comp) => ({
          projectId: id,
          bodyRegion: comp.bodyRegion,
          componentId: comp.componentId,
          textureId: comp.textureId,
          colorId: comp.colorId,
          embroideryId: comp.embroideryId,
          embroideryColor: comp.embroideryColor,
          materialOverrides: (comp.materialOverrides as any) ?? undefined,
        })),
      });
    }

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.designProject.delete({ where: { id } });
    return { success: true, message: "Design deleted successfully" };
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findOne(id, userId);

    const duplicate = await this.prisma.designProject.create({
      data: {
        name: `${original.name} (Copy)`,
        userId,
        garmentCategory: original.garmentCategory,
        isPublic: false,
        components: {
          create: original.components.map((comp) => ({
            bodyRegion: comp.bodyRegion,
            componentId: comp.componentId,
            textureId: comp.textureId,
            colorId: comp.colorId,
            embroideryId: comp.embroideryId,
            embroideryColor: comp.embroideryColor,
            materialOverrides: (comp.materialOverrides as any) ?? undefined,
          })),
        },
      },
      include: { components: true },
    });

    return duplicate;
  }

  async toggleFavorite(id: string, userId: string) {
    const project = await this.findOne(id, userId);

    return this.prisma.designProject.update({
      where: { id },
      data: { isFavorite: !project.isFavorite },
    });
  }
}
