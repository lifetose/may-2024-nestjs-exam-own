import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { UserID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { ListUserQueryDto } from './models/dto/req/list-user-query.dto';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UserBaseResDto } from './models/dto/res/user-base.res.dto';
import { UserListResDto } from './models/dto/res/user-list.res.dto';
import { UserMapper } from './services/user.mapper';
import { UsersService } from './services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData) {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ) {
    const result = await this.usersService.updateMe(userData, updateUserDto);
    return UserMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Delete('remove/me')
  public async removeMe(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.removeMe(userData);
  }

  @ApiBearerAuth()
  @Delete('delete/me')
  public async deleteMe(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteMe(userData);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiFile('avatar', false, true)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.usersService.uploadAvatar(userData, file);
  }

  @ApiBearerAuth()
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteAvatar(userData);
  }

  @ApiBearerAuth()
  @Get('all')
  public async findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
  ): Promise<UserBaseResDto[]> {
    const result = await this.usersService.findAll({ name, email });
    return result.map((user) => UserMapper.toResDto(user));
  }

  @Get('filter')
  public async filterUsers(
    @Query() query: ListUserQueryDto,
  ): Promise<UserListResDto> {
    const [entities, total] = await this.usersService.filterUsers(query);
    return UserMapper.toResDtoList(entities, total, query);
  }

  @ApiBearerAuth()
  @Get('search')
  public async findUser(
    @Query('userId') userId?: UserID,
    @Query('email') email?: string,
  ): Promise<UserBaseResDto> {
    const result = await this.usersService.findByIdOrEmail(userId, email);
    return UserMapper.toResDto(result);
  }

  @SkipAuth()
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<UserBaseResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }
}
