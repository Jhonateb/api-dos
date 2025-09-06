import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa TypeOrmModule
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity'; // <-- 2. Importa tu entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]) // <-- 3. Añade esta línea
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}