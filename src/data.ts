
export interface Location {
  name?: string;
  zip?: string;
}
export interface LocationDataFile {
  locations: Location[];
}
export interface EncodedLocation extends Location {
  name: string;
  zip: string;
  locationCode: string;
}
export interface Result extends EncodedLocation {
  rawTime:string;
  tempF:string;
  currentConditions:string;
}

export interface LocationCache {
  [key:string]: string | undefined;
}

export function validate(rawData: any): LocationDataFile {
  if (rawData && rawData.locations && rawData.locations.length) {
    return rawData as LocationDataFile;
  }
  throw new Error("JSON file must have a list of locations.")
}

