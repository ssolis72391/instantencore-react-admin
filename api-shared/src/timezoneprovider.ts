import { getTimeZones, TimeZone } from "@vvo/tzdb";

export interface TimeZoneModel {
  /**
   * IANA name
   */
  name: string;
  /**
   * Raw offset in **hours**
   */
  offset: number;
  /**
   * Current offset in **hours**
   */
  currentOffset: number;
  /**
   * Raw string
   * @example "-08:00 Pacific Time - Los Angeles, San Diego, San Jose, San Francisco"
   */
  rawString: string;
}

interface MapTimeZoneModel {
  (source: TimeZone): TimeZoneModel;
}

const mapTimeZoneModel: MapTimeZoneModel = ({
  name,
  rawFormat,
  currentTimeOffsetInMinutes,
  rawOffsetInMinutes,
}) => ({
  name,
  rawString: rawFormat,
  offset: rawOffsetInMinutes / 60,
  currentOffset: currentTimeOffsetInMinutes / 60,
});

export const TimeZoneProvider = {
  /**
   * Returns all {@link TimeZoneModel}
   * @param options If present, allows the get an ordered result. Otherwise results will be sorted by internal provider
   */
  getAll(options?: { orderBy: keyof TimeZoneModel }): TimeZoneModel[] {
    const result = getTimeZones().map(mapTimeZoneModel);
    const { orderBy } = options || {};
    return orderBy
      ? result.sort((a, b) =>
          a[orderBy] < b[orderBy] ? -1 : a[orderBy] === b[orderBy] ? 0 : 1
        )
      : result;
  },
  /**
   * Returns one {@link TimeZoneModel} by name
   */
  getOne(name: string) {
    if (!name.trim()) {
      throw Error("Defined non empty name is required");
    }
    const value = this.getAll().find((item) => item.name === name);
    if (value) {
      return value;
    }
    throw Error(`Could not find a timezone named '${name}''`);
  },
  getAllNames(): string[] {
    return this.getAll().map((item) => item.name);
  },
} as const;
