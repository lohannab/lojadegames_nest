import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>
  ) {}

  async create(categoria: Categoria): Promise<Categoria> {
    try {
      return await this.categoriaRepository.save(categoria);
    } catch (error:any) {
      throw new HttpException(
        {
          message: 'Erro ao cadastrar a categoria',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(): Promise<Categoria[]> {
    try {
      return await this.categoriaRepository.find({
        relations: {
          produtos: true,
        },
      });
    } catch (error:any) {
      throw new HttpException(
        {
          message: 'Erro ao buscar categorias',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<Categoria> {
    try {
      const categoria = await this.categoriaRepository.findOne({
        where: { id },
        relations: {
          produtos: true,
        },
      });

      if (!categoria) {
        throw new HttpException(
          'Categoria não encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      return categoria;
    } catch (error:any) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Erro ao buscar a categoria',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByTitulo(titulo: string): Promise<Categoria[]> {
    try {
      return await this.categoriaRepository.find({
        where: {
          nome: ILike(`%${titulo}%`),
        },
        relations: {
          produtos: true,
        },
      });
    } catch (error:any) {
      throw new HttpException(
        {
          message: 'Erro ao buscar categorias pelo título',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(categoria: Categoria): Promise<Categoria> {
    try {
      await this.findById(categoria.id);

      return await this.categoriaRepository.save(categoria);
    } catch (error:any) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Erro ao atualizar a categoria',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async delete(id: number) {
  try {
    const categoria = await this.findById(id);

    await this.categoriaRepository.delete(categoria.id);

    return {
      message: 'Categoria deletada com sucesso'
    };

  } catch (error: any) {

    if (error instanceof HttpException) throw error;

    throw new HttpException(
      {
        message: 'Erro ao deletar a categoria',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
}