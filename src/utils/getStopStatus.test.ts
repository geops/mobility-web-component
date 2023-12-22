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
