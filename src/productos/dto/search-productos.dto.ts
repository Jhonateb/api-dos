import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';

// DTO interno para los filtros
class FilterProductoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  sku?: string;
}

// DTO principal para la búsqueda
export class SearchProductsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: string = 'ASC';

  @IsOptional()
  @ValidateNested() // Importante: le dice a class-validator que valide el objeto anidado
  @Type(() => FilterProductoDto) // Importante: especifica el tipo del objeto anidado
  filters?: FilterProductoDto;
}