import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserID } from '../../../common/types/entity-ids.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { ListUserQueryDto } from '../models/dto/req/list-user-query.dto';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async findMe(userData: IUserData): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    this.userRepository.merge(user, dto);
    return await this.userRepository.save(user);
  }

  public async removeMe(userData: IUserData): Promise<void> {
    await this.userRepository.update(
      { id: userData.userId },
      { deleted: new Date() },
    );
    await this.refreshTokenRepository.delete({ user_id: userData.userId });
  }

  public async deleteMe(userData: IUserData): Promise<void> {
    await this.userRepository.delete({ id: userData.userId });
    await this.refreshTokenRepository.delete({ user_id: userData.userId });
  }

  public async uploadAvatar(
    userData: IUserData,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const pathToFile = await this.fileStorageService.uploadFile(
      'avatars',
      file,
      ContentType.IMAGE,
      userData.userId,
    );
    if (user.image) {
      await this.fileStorageService.deleteFile('avatars', user.image);
    }
    await this.userRepository.save({ ...user, image: pathToFile });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.fileStorageService.deleteFile('avatars', user.image);
      await this.userRepository.save({ ...user, image: null });
    }
  }

  public async findAll(
    filters?: Partial<{ name: string; email: string }>,
  ): Promise<UserEntity[]> {
    const where: any = {};

    if (filters?.name) {
      where.name = filters.name;
    }
    if (filters?.email) {
      where.email = filters.email;
    }

    return await this.userRepository.find({ where });
  }

  public async filterUsers(
    query: ListUserQueryDto,
  ): Promise<[UserEntity[], number]> {
    return await this.userRepository.filterUsers(query);
  }

  public async findByIdOrEmail(
    userId?: UserID,
    email?: string,
  ): Promise<UserEntity> {
    if (!userId && !email) {
      throw new BadRequestException('Provide either an ID or an email.');
    }
    if (userId) {
      return await this.userRepository.findOneBy({ id: userId });
    }
    if (email) {
      return await this.userRepository.findOneBy({ email });
    }
    throw new NotFoundException('User not found');
  }

  public async findOne(userId: UserID): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userId });
  }
}
