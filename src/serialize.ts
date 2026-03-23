import { Pack } from "./pack";

export function serializePack(value: Pack[]) {
  return JSON.stringify(value);
}
export function deserializePack(value: string) {
  const json = JSON.parse(value) as Object[];
  return json.map((item) => {
    return Object.assign(new Pack(), item);
  }) as Pack[];
}
