import { Global, Module } from '@nestjs/common';

import { PostRepository } from './services/post.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [PostRepository, RefreshTokenRepository, UserRepository];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
