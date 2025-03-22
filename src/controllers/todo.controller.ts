import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
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
import {Todo, TodoWithItems} from '../models';
import {ItemRepository, TodoRepository} from '../repositories';
import {TodoServiceService} from '../services/todo-service.service';

export class TodoController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
    @inject('services.TodoServiceService')
    public todoService: TodoServiceService, // 注入 TodoServiceService
  ) {}

  @post('/todos')
  @response(200, {
    description: '新增 Todo 與其 Items',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async createTodoWithItems(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoWithItems, {
            title: 'NewTodoWithItems',
            exclude: ['id'],
          }), // 使用 TodoWithItems 模型
        },
      },
    })
    todoData: TodoWithItems,
  ): Promise<Todo> {
    return this.todoService.createTodoWithItems(todoData); // 使用 TodoServiceService
  }

  @get('/todos')
  @response(200, {
    description:
      '取得所有 Todo - 支援分頁(page、pageSize)、篩選(標題、副標題、狀態)',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Todo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.query.number('page') page: number = 1, //預設為 1
    @param.query.number('pageSize') pageSize: number = 10, //預設為 10
    @param.query.string('title') title?: string,
    @param.query.string('subtitle') subtitle?: string,
    @param.query.string('status') status?: string,
  ): Promise<Todo[]> {
    // return this.todoRepository.find(filter);
    const findFilter: Filter<Todo> = {
      include: [{relation: 'items'}], // 包含 items
      limit: pageSize,
      offset: (page - 1) * pageSize, // 計算 offset
      where: {
        ...(title && {title: {like: `%${title}%`}}),
        ...(subtitle && {subtitle: {like: `%${subtitle}%`}}),
        ...(status && {status: {neq: 'DELETED'}}),
      },
    };

    return this.todoRepository.find(findFilter);
  }

  @get('/todos/{id}')
  @response(200, {
    description: '取得單一 Todo by Id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>,
  ): Promise<Todo> {
    // return this.todoRepository.findById(id, filter);
    const findFilter: Filter<Todo> = {
      include: [{relation: 'items'}], // 包含 items
      where: {
        status: {neq: 'DELETED'},
      },
    };

    return this.todoRepository.findById(id, findFilter);
  }

  @patch('/todos/{id}')
  @response(204, {
    description: '更新 Todo by Id',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    await this.todoRepository.updateById(id, todo);
  }

  @put('/todos/{id}')
  @response(204, {
    description: '更新 Todo by Id',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<void> {
    await this.todoRepository.replaceById(id, todo);
  }

  //軟刪除
  @del('/todos/{id}')
  @response(204, {
    description: '軟刪除 Todo by Id',
  })
  async softDeleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoRepository.softDeleteById(id);
  }
}
