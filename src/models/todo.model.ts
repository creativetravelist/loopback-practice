import {Entity, hasMany, model, property} from '@loopback/repository';
import {Item} from './item.model';

export type TodoStatus = 'ACTIVE' | 'COMPLETED' | 'DELETED';

@model()
export class Todo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['ACTIVE', 'COMPLETED', 'DELETED'],
    },
    default: 'ACTIVE',
  })
  status: TodoStatus;

  @property({
    type: 'string',
  })
  subtitle?: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;

  @hasMany(() => Item, {keyTo: 'todo_id'})
  items: Item[];

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
