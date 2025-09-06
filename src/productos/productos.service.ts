import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { SearchProductsDto } from './dto/search-productos.dto';

@Injectable()
export class ProductosService {
  // Inyectamos el repositorio de Producto para poder interactuar con la base de datos.
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  /**
   * Crea un nuevo producto en la base de datos.
   * Regla de negocio: El SKU debe ser único.
   */
  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(createProductoDto);
    try {
      return await this.productoRepository.save(nuevoProducto);
    } catch (error) {
      // Código de error para violación de constraint 'unique' en PostgreSQL.
      if (error.code === '23505') {
        throw new ConflictException(`El SKU '${createProductoDto.sku}' ya existe.`);
      }
      // Si es otro tipo de error, lo lanzamos igualmente.
      throw error;
    }
  }

  /**
   * Devuelve todos los productos.
   */
  findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  /**
   * Busca un producto por su ID.
   */
  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }
    return producto;
  }

  /**
   * Actualiza un producto.
   * Regla de negocio: El stock no puede ser negativo (cubierto por el DTO, pero es buena práctica).
   */
  async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    // Preload busca el producto por ID y lo fusiona con los nuevos datos del DTO.
    const producto = await this.productoRepository.preload({
      id,
      ...updateProductoDto,
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }

    try {
      return await this.productoRepository.save(producto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El SKU '${updateProductoDto.sku}' ya existe.`);
      }
      throw error;
    }
  }

  /**
   * Elimina un producto.
   * Regla de negocio: No se puede eliminar si tiene stock > 0.
   */
  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);

    // Aplicamos la regla de negocio.
    if (producto.stock > 0) {
      throw new BadRequestException(
        `No se puede eliminar el producto '${producto.nombre}' porque tiene stock (${producto.stock}).`,
      );
    }

    const result = await this.productoRepository.delete(id);
    
    // Por si acaso, verificamos si algo fue realmente eliminado.
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }
  }



    async search(searchDto: SearchProductsDto) {
    const { page = 1, limit = 10, sortBy = 'id', order = 'ASC', filters = {} } = searchDto;
    const { id, nombre, descripcion, sku } = filters;

    const queryBuilder = this.productoRepository.createQueryBuilder('producto');

    // Aplicando filtros dinámicamente
    if (id) {
      queryBuilder.andWhere('producto.id = :id', { id });
    }
    if (sku) {
      queryBuilder.andWhere('producto.sku = :sku', { sku });
    }
    if (nombre) {
      // Usamos ILIKE para búsquedas case-insensitive (ignora mayúsculas/minúsculas)
      queryBuilder.andWhere('producto.nombre ILIKE :nombre', { nombre: `%${nombre}%` });
    }
    if (descripcion) {
      queryBuilder.andWhere('producto.descripcion ILIKE :descripcion', { descripcion: `%${descripcion}%` });
    }

    // Aplicando ordenamiento
    queryBuilder.orderBy(`producto.${sortBy}`, order as 'ASC' | 'DESC');
    
    // Aplicando paginación
    queryBuilder.skip((page - 1) * limit).take(limit);

    // getManyAndCount es una maravilla: ejecuta la consulta y también cuenta el total de resultados (sin paginación)
    const [data, totalItems] = await queryBuilder.getManyAndCount();

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
  }
}

