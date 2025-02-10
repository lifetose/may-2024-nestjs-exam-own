import { Injectable } from '@nestjs/common';

import { PostID, UserID } from '../../../common/types/entity-ids.type';
import { PostEntity } from '../../../database/entities/post.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { PostRepository } from '../../repository/services/post.repository';
import { CreatePostDto } from '../models/dto/req/create-post.dto';
import { ListPostQueryDto } from '../models/dto/req/list-post-query.dto';
import { UpdatePostDto } from '../models/dto/req/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  public async create(
    userData: IUserData,
    dto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postRepository.save({
      ...dto,
      user_id: userData.userId,
    });
  }

  public async findAll(
    userData: IUserData,
    query: ListPostQueryDto,
  ): Promise<[PostEntity[], number]> {
    return await this.postRepository.findAll(userData, query);
  }

  public async findOne(
    userData: IUserData,
    postId: PostID,
  ): Promise<PostEntity> {
    return await this.postRepository.getById(userData, postId);
  }

  public async deletePost(userData: IUserData, postId: PostID): Promise<void> {
    const post = await this.postRepository.getById(userData, postId);

    if (!post || post.user.id !== userData.userId) {
      throw new Error('You can only delete your own posts.');
    }

    await this.postRepository.delete(postId);
  }

  public async editPost(
    userData: IUserData,
    postId: PostID,
    dto: UpdatePostDto,
  ): Promise<PostEntity> {
    const post = await this.postRepository.getById(userData, postId);

    if (!post || post.user.id !== userData.userId) {
      throw new Error('You can only edit your own posts.');
    }

    return await this.postRepository.save({ ...post, ...dto });
  }

  public async findUserPosts(
    userId: UserID,
    query: ListPostQueryDto,
  ): Promise<[PostEntity[], number]> {
    return await this.postRepository.findUserPosts(userId, query);
  }
}
