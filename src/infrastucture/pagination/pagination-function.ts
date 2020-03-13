import { Paginator } from './paginator.interface';
import { PaginationOptions } from './pagination-options.interface';


export function constructPagination<T>(data: T[], options: PaginationOptions): Paginator<T[]> {
  return {
    data: data,
    totalPages: Math.ceil(options.total / options.limit),
    totalItems: options.total
  }
}
