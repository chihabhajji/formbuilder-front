export const flatTree = ((id: number) => (parent: number | null) => ({fields = [], ...object}: any) =>
    [{id: ++id, ...object, parent}, ...fields.flatMap(flatTree(id))])(0);
