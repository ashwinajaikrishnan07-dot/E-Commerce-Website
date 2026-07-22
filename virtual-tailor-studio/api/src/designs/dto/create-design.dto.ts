import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";

export class DesignComponentDto {
  @IsString()
  bodyRegion: string;

  @IsOptional()
  @IsString()
  componentId?: string;

  @IsOptional()
  @IsString()
  textureId?: string;

  @IsOptional()
  @IsString()
  colorId?: string;

  @IsOptional()
  @IsString()
  embroideryId?: string;

  @IsOptional()
  @IsString()
  embroideryColor?: string;

  @IsOptional()
  @IsObject()
  materialOverrides?: Record<string, unknown>;
}

export class CreateDesignDto {
  @IsString()
  name: string;

  @IsString()
  garmentCategory: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DesignComponentDto)
  components?: DesignComponentDto[];
}
