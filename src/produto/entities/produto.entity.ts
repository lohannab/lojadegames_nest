import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity("tb_produto")
export class Produto {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  preco!: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
  categoria!: Categoria;
}