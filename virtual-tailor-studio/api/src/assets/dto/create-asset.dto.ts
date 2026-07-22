import { IsString, IsOptional, IsEnum, IsObject } from "class-validator";

export enum AssetType {
  MODEL = "MODEL",
  TEXTURE = "TEXTURE",
  EMBROIDERY = "EMBROIDERY",
  THUMBNAIL = "THUMBNAIL",
  OTHER = "OTHER",
}

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsEnum(AssetType)
  type: AssetType;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  bodyPartId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
