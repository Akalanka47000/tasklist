export function filterDirtyFields(dirtyFields: Record<string, any>, values: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in dirtyFields) {
    result[key] = values[key];
  }
  return result as any;
}
