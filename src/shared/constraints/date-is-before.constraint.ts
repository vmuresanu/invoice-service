import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import * as moment from 'moment';

@ValidatorConstraint({ name: "isBefore", async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {

    validate(propertyValue: string, args: ValidationArguments) {
    
        return moment(propertyValue).isBefore(args.object[args.constraints[0]]);
    }

    defaultMessage(args: ValidationArguments) {
      return `${args.property} must be before ${args.constraints[0]}`;
    }
}