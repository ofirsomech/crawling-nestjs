export const ApiManagerUtil = {
  mapToObject(map: Map<string, any>): object {
    const parameterObject: object = {};
    if (map) {
      for (const [key, value] of map) {
        parameterObject[key] = value;
      }
    }
    return parameterObject;
  },
};
