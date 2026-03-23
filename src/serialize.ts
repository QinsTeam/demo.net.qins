import { Pack } from "./pack";

export function serializePack(value: Pack[]) {
  return JSON.stringify(value);
}
export function deserializePack(value: string) {
    if (value == "") {
        return [];
    }
    const json = JSON.parse(value) as Object[];
    console.log(json);
    return Object.values(json).map((item) => {
        return Object.assign(new Pack(), item);
    }) as Pack[];
}
