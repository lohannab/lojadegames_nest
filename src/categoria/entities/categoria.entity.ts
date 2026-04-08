import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';

@Entity("tb_categoria")
export class Categoria {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos!: Produto[];
}