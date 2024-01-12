import getStopStatus from "./getStopStatus";

describe("getStopStatus", () => {
  describe("when the station is empty", () => {
    it("returns a correct status", () => {
      const stopSequence = {
        stations: [{}],
      };
      const {
        // progress,
        // isInBetween,
        // isCancelled,
        // isFirst,
        // isLast,
        // isPassed,
        // isLeft,
        // isNotRealtime,
        isNotStop,
        // isBoarding,
        // isNextStop,
        // isCloseToNextStop,
        // @ts-ignore
      } = getStopStatus(stopSequence, 0);
      expect(isNotStop).toBe(true);
    });

    it("returns a correct isNotRealtime status", () => {
      const stopSequence = {
        stations: [
          { state: "PENDING", arrivalDelay: null, departureDelay: null },
          { state: "TIME_BASED", arrivalDelay: null, departureDelay: null },
          { state: "PENDING", arrivalDelay: 0, departureDelay: 0 },
          { state: "TIME_BASED", arrivalDelay: 0, departureDelay: 0 },
        ],
      };
      let {
        isNotRealtime,
        // @ts-ignore
      } = getStopStatus(stopSequence, 0);
      expect(isNotRealtime).toBe(true);
      // @ts-ignore
      isNotRealtime = getStopStatus(stopSequence, 1).isNotRealtime;
      expect(isNotRealtime).toBe(true);
      // @ts-ignore
      isNotRealtime = getStopStatus(stopSequence, 2).isNotRealtime;
      expect(isNotRealtime).toBe(false);
      // @ts-ignore
      isNotRealtime = getStopStatus(stopSequence, 3).isNotRealtime;
      expect(isNotRealtime).toBe(true);
    });
  });

  describe("when it's the first station", () => {
    it("returns a correct status", () => {
      const stopSequence = {
        stations: [{}],
      };
      const {
        progress,
        // isInBetween,
        // isCancelled,
        isFirst,
        // isLast,
        // isPassed,
        // isLeft,
        // isNotRealtime,
        // isNotStop,
        // isBoarding,
        isNextStop,
        // isCloseToNextStop,
        // @ts-ignore
      } = getStopStatus(stopSequence, 0);
      expect(progress).toBe(50);
      expect(isFirst).toBe(true);
      expect(isNextStop).toBe(true);
    });
  });
  describe("when it's the first station", () => {
    it("returns a correct status", () => {
      const stopSequence = {
        stations: [{}],
      };
      const {
        progress,
        // isInBetween,
        // isCancelled,
        isFirst,
        // isLast,
        // isPassed,
        // isLeft,
        // isNotRealtime,
        isNotStop,
        // isBoarding,
        isNextStop,
        // isCloseToNextStop,
        // @ts-ignore
      } = getStopStatus(stopSequence, 0);
      expect(progress).toBe(50);
      expect(isFirst).toBe(true);
      expect(isNextStop).toBe(true);
      expect(isNotStop).toBe(true);
    });
  });
});
