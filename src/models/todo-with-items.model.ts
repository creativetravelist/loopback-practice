import {model, property} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';
import {Item} from './item.model';
import {Todo} from './todo.model';

@model()
export class TodoWithItems extends Todo {
  @property.array(Item, {
    item: getModelSchemaRef(Item, {exclude: ['id']}), // 保持 `id` 被排除
  })
  items: Item[];
}
