export const formatRoute = (route: string, params: Record<string, string|number>): string => {
  let path = route;

  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key].toString());
  });

  return path;
};
