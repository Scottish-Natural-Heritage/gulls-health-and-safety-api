/**
 * Transform Errors to plain JSON objects so they can be logged via
 * `JSON.stringify`.
 *
 * @param {Error | any} json Some JSON that might be an error.
 * @returns {any} The untransformed JSON if it was not an error, otherwise a
 * new object with the same keys and values as the Error, but as a plain JSON
 * object.
 */
const unErrorJson = (json: Error | any): any => {
  if (json instanceof Error) {
    const error: Error = json;
    const unError: any = {};

    for (const key of Object.getOwnPropertyNames(error)) {
      unError[key] = (error as any)[key];
    }

    return unError;
  }

  return json;
};

const JsonUtils = {
  unErrorJson,
};

export default JsonUtils;
