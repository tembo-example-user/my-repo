import { calcChange } from "../metrics";

describe("calcChange", () => {
  it("returns 100 when previous is 0 and current is positive", () => {
    expect(calcChange(50, 0)).toBe(100);
  });

  it("returns 0 when both current and previous are 0", () => {
    expect(calcChange(0, 0)).toBe(0);
  });

  it("returns positive percentage for growth", () => {
    expect(calcChange(150, 100)).toBe(50);
  });

  it("returns negative percentage for decline", () => {
    expect(calcChange(50, 100)).toBe(-50);
  });

  it("returns 0 when current equals previous", () => {
    expect(calcChange(100, 100)).toBe(0);
  });

  it("returns -100 when current drops to 0 from a positive value", () => {
    expect(calcChange(0, 100)).toBe(-100);
  });

  it("rounds to the nearest integer", () => {
    expect(calcChange(1, 3)).toBe(-67);
    expect(calcChange(2, 3)).toBe(-33);
  });

  it("handles large growth correctly", () => {
    expect(calcChange(1000, 10)).toBe(9900);
  });

  it("returns 100 for any positive current when previous is 0", () => {
    expect(calcChange(1, 0)).toBe(100);
    expect(calcChange(999, 0)).toBe(100);
  });
});
