interface Validation {
  rule: string;
  fieldNames: string[];
  message: string;
  additionalArgs?: { [propName: string]: Number | string };
}

interface ErrorMessages {
  [fieldName: string]: string[];
}

export class ValidationError extends Error {
  constructor(public messages: ErrorMessages) {
    super();
  }
}

export class ValidatorConfigError extends Error {
  name: string = this.constructor.name;
}

export class RequestDataTypeError extends Error {
  name: string = this.constructor.name;

  constructor(public propTypes: { [propName: string]: string }) {
    super();
  }
}

export abstract class Validator<T extends object> {
  private validations: Validation[] = [];
  private errorMessages: ErrorMessages = {};

  protected abstract isProvidedType(data: any): data is T;
  abstract setUpValidator(): Validator<T>;

  validate = (data: T) => {
    if (!this.isProvidedType(data)) {
      const propTypesArray = Object.entries(data)
        .map(([propName, propValue]) => {
          return [propName, typeof propValue];
        });
      const propTypes = Object.fromEntries(propTypesArray);
      throw new RequestDataTypeError(propTypes);
    }

    Object.entries(data).forEach(([fieldName, fieldValue]) => {
      this.validations.forEach(validation => {
        if (!validation.fieldNames.includes(fieldName)) return;

        const rule = validation.rule;
        const ruleMethod = this[rule as keyof this] as Function;

        const message = validation.message;

        try {
          const result = 'additionalArgs' in validation
            ? ruleMethod(fieldValue, validation.additionalArgs)
            : ruleMethod(fieldValue);

          if (result) return;

          if (fieldName in this.errorMessages) {
            this.errorMessages[fieldName].push(message);
            return;
          }
          Object.assign(this.errorMessages, { [fieldName]: [message] });
        } catch (error) {
          if (error instanceof ValidatorConfigError) {
            error.message += ` (Target field: ${fieldName})`;
          }
          throw error;
        }
      });
    });

    if (Object.keys(this.errorMessages).length !== 0) {
      throw new ValidationError(this.errorMessages);
    }
  };

  add = (validation: Validation) => {
    const rule = validation.rule;

    if (!rule.startsWith('must')) {
      const message = 'Validation rule names must start with the word "must".'
        + ` (Invalid rule name: ${rule})`;
      throw new ValidatorConfigError(message);
    }

    const ruleMethod = this[rule as keyof this];

    if (typeof ruleMethod !== 'function') {
      throw new ValidatorConfigError(`The Rule "${rule}" does not exist.`);
    }

    this.validations.push(validation);
  };

  private mustNotBeEmpty = (fieldValue: any) => {
    if (typeof fieldValue !== 'string') {
      const message = 'The rule "mustNotBeEmpty" must be used'
        + ' for string fields.';
      throw new ValidatorConfigError(message);
    }

    return Boolean(fieldValue);
  };

  private mustBeInRange = (
      fieldValue: any, additionalArgs: { min: Number, max: Number }) => {
    if (typeof fieldValue !== 'number' && typeof fieldValue !== 'string') {
      const message = 'The rule "mustBeInRange" must be used'
        + ' for number or string fields.';
      throw new ValidatorConfigError(message);
    }

    const length = typeof fieldValue === 'string'
      ? fieldValue.length
      : fieldValue;

    return length >= additionalArgs.min && length <= additionalArgs.max;
  };
}
