import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'isBeforeDate', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {

  validate(propertyValue: string, args: ValidationArguments): boolean {

    return moment(propertyValue).isBefore(args.object[args.constraints[0]]);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be before ${args.constraints[0]}`;
  }
}

@ValidatorConstraint({ name: 'isSameOrBeforeDate', async: false })
export class IsSameOrBeforeConstraint implements ValidatorConstraintInterface {

  validate(propertyValue: string, args: ValidationArguments): boolean {
    return moment(propertyValue).isSameOrBefore(args.object[args.constraints[0]]);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be before ${args.constraints[0]}`;
  }
}

@ValidatorConstraint({ name: 'isBeforeTimeIfDate', async: false })
export class IsBeforeTimeIfDateConstraint implements ValidatorConstraintInterface {

  validate(propertyValue: string, args: ValidationArguments): boolean {
    const request = args.object as any;
    if (request.startDate !== request.endDate) {
      return true;
    }
    const startTime = moment(propertyValue, 'hh:mm');
    const endTime = moment(request.endTime, 'hh:mm');
    return startTime.isBefore(endTime);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be before ${args.constraints[2]}`;
  }
}
