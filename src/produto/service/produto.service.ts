import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutoService {

  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>
  ) {}

  async create(produto: Produto): Promise<Produto> {
    try {
      return await this.produtoRepository.save(produto);
    } catch (error: any) {
      throw new HttpException(
        {
          message: 'Erro ao cadastrar o produto',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(): Promise<Produto[]> {
    try {
      return await this.produtoRepository.find({
        relations: {
          categoria: true,
        },
      });
    } catch (error: any) {
      throw new HttpException(
        {
          message: 'Erro ao buscar produtos',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<Produto> {
    try {
      const produto = await this.produtoRepository.findOne({
        where: { id },
        relations: {
          categoria: true,
        },
      });

      if (!produto) {
        throw new HttpException(
          'Produto não encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      return produto;

    } catch (error: any) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Erro ao buscar o produto',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByNome(nome: string): Promise<Produto[]> {
    try {
      return await this.produtoRepository.find({
        where: {
          nome: ILike(`%${nome}%`),
        },
        relations: {
          categoria: true,
        },
      });
    } catch (error: any) {
      throw new HttpException(
        {
          message: 'Erro ao buscar produtos pelo nome',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(produto: Produto): Promise<any> {
  try {
    await this.findById(produto.id);

    const produtoAtualizado = await this.produtoRepository.save(produto);

    return {
      message: 'Produto atualizado com sucesso',
      data: produtoAtualizado
    };

  } catch (error: any) {

    if (error instanceof HttpException) throw error;

    throw new HttpException(
      {
        message: 'Erro ao atualizar o produto',
        error: error.message,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

  async delete(id: number) {
  try {
    const produto = await this.findById(id);

    await this.produtoRepository.delete(produto.id);

    return {
      message: 'Produto deletado com sucesso'
    };

  } catch (error: any) {

    if (error instanceof HttpException) throw error;

    throw new HttpException(
      {
        message: 'Erro ao deletar o produto',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
}

