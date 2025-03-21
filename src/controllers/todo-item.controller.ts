import {repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Item} from '../models';
import {TodoRepository} from '../repositories';

export class TodoItemController {
  constructor(
    @repository(TodoRepository) protected todoRepository: TodoRepository,
  ) {}

  @get('/todos/{id}/items', {
    responses: {
      '200': {
        description:
          '取得某Todo下所有 Items - 支援篩選(是否完成、內容、完成時間區間)',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Item)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.string('is_completed') isCompleted?: boolean,
    @param.query.string('content') content?: string,
    @param.query.string('completed_at_start') completedAtStart?: string,
    @param.query.string('completed_at_end') completedAtEnd?: string,
  ): Promise<Item[]> {
    const where: Where<Item> = {
      ...(isCompleted !== undefined && {is_completed: isCompleted}),
      ...(content && {content: {like: `%${content}%`}}),
      ...(completedAtStart || completedAtEnd
        ? {
            completed_at: {
              ...(completedAtStart && {gte: completedAtStart}),
              ...(completedAtEnd && {lte: completedAtEnd}),
            },
          }
        : {}),
    };

    return this.todoRepository.items(id).find({where});
  }
}
