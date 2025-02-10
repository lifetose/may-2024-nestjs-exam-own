import { UserEntity } from '../../../database/entities/user.entity';
import { IJwtPayload } from '../../auth/models/interfaces/jwt-payload.interface';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { ListUserQueryDto } from '../models/dto/req/list-user-query.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';
import { UserListResDto } from '../models/dto/res/user-list.res.dto';

export class UserMapper {
  public static toResDtoList(
    data: UserEntity[],
    total: number,
    query: ListUserQueryDto,
  ): UserListResDto {
    return { data: data.map(this.toResDto), total, ...query };
  }

  public static toResDto(user: UserEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image
        ? `${process.env.AWS_S3_ENDPOINT}/avatars/${user.image}`
        : null,
    };
  }

  public static toIUserData(
    user: UserEntity,
    jwtPayload: IJwtPayload,
  ): IUserData {
    return {
      userId: user.id,
      deviceId: jwtPayload.deviceId,
      email: user.email,
    };
  }
}
