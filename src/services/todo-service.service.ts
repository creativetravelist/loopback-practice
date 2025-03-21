import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Todo, TodoWithItems} from '../models';
import {ItemRepository, TodoRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class TodoServiceService {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
    @repository(ItemRepository) // Inject ItemRepository
    public itemRepository: ItemRepository,
  ) {}

  async createTodoWithItems(todoData: TodoWithItems): Promise<Todo> {
    const todo = await this.todoRepository.create({
      title: todoData.title,
      status: todoData.status,
      subtitle: todoData.subtitle,
    });

    if (todoData.items?.length) {
      await Promise.all(
        todoData.items.map(itemData =>
          this.itemRepository.create({...itemData, todo_id: todo.id}),
        ),
      );
    }

    return todo;
  }
}
