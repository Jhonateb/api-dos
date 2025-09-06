import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity({ name: 'productos' })
@Unique(['sku']) // Asegura que el SKU sea único a nivel de base de datos
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  precio: number;

  @Column('int', { nullable: false, default: 0 })
  stock: number;

  @Column('varchar', { length: 50, nullable: false })
  sku: string;
}