import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Item} from '../models';
import {ItemRepository} from '../repositories';

export class ItemController {
  constructor(
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
  ) {}

  @post('/items')
  @response(200, {
    description: '新增 Item',
    content: {'application/json': {schema: getModelSchemaRef(Item)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {
            title: 'NewItem',
            exclude: ['id'],
          }),
        },
      },
    })
    item: Omit<Item, 'id'>,
  ): Promise<Item> {
    if (item.completed_at === null) {
      delete item.completed_at;
    }
    return this.itemRepository.create(item);
  }

  @get('/items/{id}')
  @response(200, {
    description: '取得單一 Item by Id ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Item, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Item, {exclude: 'where'}) filter?: FilterExcludingWhere<Item>,
  ): Promise<Item> {
    return this.itemRepository.findById(id, filter);
  }

  @patch('/items/{id}')
  @response(204, {
    description: '更新 Item by Id ',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {partial: true}),
        },
      },
    })
    item: Item,
  ): Promise<void> {
    await this.itemRepository.updateById(id, item);
  }

  @put('/items/{id}')
  @response(204, {
    description: '更新 Item by Id',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() item: Item,
  ): Promise<void> {
    await this.itemRepository.replaceById(id, item);
  }

  @del('/items/{id}')
  @response(204, {
    description: '刪除 Item by Id ',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.itemRepository.deleteById(id);
  }
}
