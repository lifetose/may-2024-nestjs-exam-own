import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PostID, UserID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { UsersService } from '../users/services/users.service';
import { CreatePostDto } from './models/dto/req/create-post.dto';
import { ListPostQueryDto } from './models/dto/req/list-post-query.dto';
import { UpdatePostDto } from './models/dto/req/update-post.dto';
import { PostResDto } from './models/dto/res/post.res.dto';
import { PostListResDto } from './models/dto/res/post-list.res.dto';
import { PostsMapper } from './services/posts.mapper';
import { PostsService } from './services/posts.service';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreatePostDto,
  ): Promise<PostResDto> {
    const result = await this.postService.create(userData, dto);
    return PostsMapper.toResDto(result);
  }

  @Get()
  public async findAll(
    @CurrentUser() userData: IUserData,
    @Query() query: ListPostQueryDto,
  ): Promise<PostListResDto> {
    const [entities, total] = await this.postService.findAll(userData, query);
    return PostsMapper.toResDtoList(entities, total, query);
  }

  @Get(':postId')
  public async findOne(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: PostID,
  ): Promise<PostResDto> {
    const result = await this.postService.findOne(userData, postId);
    return PostsMapper.toResDto(result);
  }

  @Delete(':postId')
  public async deletePost(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: PostID,
  ): Promise<void> {
    await this.postService.deletePost(userData, postId);
  }

  @Put(':postId')
  public async editPost(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: PostID,
    @Body() dto: UpdatePostDto,
  ): Promise<PostResDto> {
    const updatedPost = await this.postService.editPost(userData, postId, dto);
    return PostsMapper.toResDto(updatedPost);
  }

  @SkipAuth()
  @Get('user/:userId')
  public async findUserPosts(
    @Param('userId', ParseUUIDPipe) userId: UserID,
    @Query() query: ListPostQueryDto,
  ): Promise<PostListResDto> {
    const userExists = await this.usersService.findOne(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const [entities, total] = await this.postService.findUserPosts(
      userId,
      query,
    );
    return PostsMapper.toResDtoList(entities, total, query);
  }
}
