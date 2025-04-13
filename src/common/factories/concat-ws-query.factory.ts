export const concatWsQueryFactory =
  (columns: string[], delimiter = ' ') =>
  (alias: string): string => {
    const columnsString = columns.map((f) => `${alias}."${f}"`).join(', ');

    return `concat_ws('${delimiter}', ${columnsString})`;
  };
