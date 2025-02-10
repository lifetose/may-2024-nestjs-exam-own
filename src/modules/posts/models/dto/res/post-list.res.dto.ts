import { ListPostQueryDto } from '../req/list-post-query.dto';
import { PostResDto } from './post.res.dto';

export class PostListResDto extends ListPostQueryDto {
  data: PostResDto[];
  total: number;
}
