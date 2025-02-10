import { Injectable } from '@nestjs/common';
import { ListUserQueryDto } from 'src/modules/users/models/dto/req/list-user-query.dto';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async filterUsers(
    query: ListUserQueryDto,
  ): Promise<[UserEntity[], number]> {
    const qb = this.createQueryBuilder('user');

    if (query.name) {
      qb.andWhere('user.name LIKE :name', { name: `%${query.name}%` });
    }

    if (query.email) {
      qb.andWhere('user.email LIKE :email', { email: `%${query.email}%` });
    }

    const sortOrder = query.sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    qb.orderBy('user.created', sortOrder);

    const page = query.page || 1;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    qb.skip(skip).take(limit);

    return await qb.getManyAndCount();
  }
}
