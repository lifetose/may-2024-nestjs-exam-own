import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { PostID, UserID } from '../../../common/types/entity-ids.type';
import { PostEntity } from '../../../database/entities/post.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { ListPostQueryDto } from '../../posts/models/dto/req/list-post-query.dto';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostEntity, dataSource.manager);
  }

  public async findAll(
    userData: IUserData,
    query: ListPostQueryDto,
  ): Promise<[PostEntity[], number]> {
    const qb = this.createQueryBuilder('post');

    if (query.search) {
      qb.andWhere('CONCAT(post.title, post.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    const sortOrder = query.sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    qb.orderBy('post.created', sortOrder);

    const page = query.page || 1;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    qb.skip(skip).take(limit);

    qb.leftJoinAndSelect('post.user', 'user');

    return await qb.getManyAndCount();
  }

  public async getById(
    userData: IUserData,
    postId: PostID,
    em?: EntityManager,
  ): Promise<PostEntity> {
    const repo = em ? em.getRepository(PostEntity) : this;

    const qb = repo.createQueryBuilder('post');

    qb.leftJoinAndSelect('post.user', 'user');

    qb.where('post.id = :postId', { postId });
    return await qb.getOne();
  }

  public async findUserPosts(
    userId: UserID,
    query: ListPostQueryDto,
  ): Promise<[PostEntity[], number]> {
    const qb = this.createQueryBuilder('post').where('post.user_id = :userId', {
      userId,
    });

    if (query.search) {
      qb.andWhere('CONCAT(post.title, post.description) ILIKE :search', {
        search: `%${query.search}%`,
      });
    }
    const page = query.page || 1;
    const limit = query.limit;

    const skip = (page - 1) * limit;
    const take = limit;

    qb.skip(skip).take(take);

    qb.leftJoinAndSelect('post.user', 'user');

    return await qb.getManyAndCount();
  }
}
