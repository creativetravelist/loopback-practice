import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Todo} from './todo.model';

@model()
export class Item extends Entity {
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
  content: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  is_completed: boolean;

  @property({
    type: 'date',
    jsonSchema: {
      nullable: true, // 允許 `null`
    },
  })
  completed_at?: string | null;

  @property({
    type: 'date',
  })
  create_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;

  @belongsTo(() => Todo, {name: 'todos'})
  todo_id: number;

  constructor(data?: Partial<Item>) {
    super(data);
  }
}

export interface ItemRelations {
  // describe navigational properties here
}

export type ItemWithRelations = Item & ItemRelations;
