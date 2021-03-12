import { RootState } from "../../store";

const aggregateAndSelectKey = (array: Array<any>, key: string): Array<string> =>
  array.reduce(
    (acc, val) =>
      acc.includes(val[key]) && val[key] !== null ? acc : [...acc, val[key]],
    []
  );

export const selectLitterTypeByMaterial = (
  state: RootState
): Array<string> => {
  return aggregateAndSelectKey(state.measurements.litterTypes, "material");
};
