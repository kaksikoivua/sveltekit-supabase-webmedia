import { error as svelteKitError } from '@sveltejs/kit';

import {
  RequestDataTypeError,
  ValidationError,
  ValidatorConfigError
} from '$lib/server/validation';

export const handleError = (error: any) => {
  if (error instanceof ValidationError) {
    throw svelteKitError(422, error);
  } else if (error instanceof ValidatorConfigError) {
    console.log(error.stack);
    throw svelteKitError(500, 'Internal Error');
  } else if (error instanceof RequestDataTypeError) {
    console.log(error.stack);
    console.log('[Request Data]');
    console.table(error.propTypes);
    throw svelteKitError(400, 'Bad Request');
  } else if (error instanceof Error) {
    console.log(error.stack);
    throw svelteKitError(500, 'Internal Error');
  }
};
