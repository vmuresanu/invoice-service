import { IsEnum } from 'class-validator'
import { Column } from 'typeorm'

export function Enum(
  typeFunction: (type?: any) => object,
  options: any
) {
  const isEnumDecorator = IsEnum(typeFunction());
  const columnDecorator = Column({
    default: options.default,
    enum: typeFunction(),
    type: 'enum',
  });
  return (target: any, key: string) => {
    isEnumDecorator(target, key);
    columnDecorator(target, key);
  }
}
