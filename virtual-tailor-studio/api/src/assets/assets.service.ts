import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAssetDto } from "./dto/create-asset.dto";

/**
 * AssetsService
 * Manages media assets — upload, retrieval, deletion.
 * In production, integrates with Cloudinary or S3.
 */
@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(dto: CreateAssetDto, file: Express.Multer.File, userId: string) {
    // In production: upload to Cloudinary/S3 and get URL
    const url = `/uploads/${file.filename}`;
    const thumbnailUrl = url; // Generate thumbnail in production

    const media = await this.prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        thumbnailUrl,
        type: dto.type,
        metadata: (dto.metadata as any) ?? undefined,
        uploadedBy: userId,
      },
    });

    return media;
  }

  async findAll(type?: string, page = 1, pageSize = 50) {
    const skip = (page - 1) * pageSize;
    const where = type ? { type: type as any } : {};

    const [assets, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: assets,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const asset = await this.prisma.media.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException(`Asset ${id} not found`);
    return asset;
  }

  async remove(id: string) {
    await this.findOne(id);
    // In production: also delete from Cloudinary/S3
    await this.prisma.media.delete({ where: { id } });
    return { success: true, message: "Asset deleted" };
  }
}
