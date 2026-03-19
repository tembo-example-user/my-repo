import { activityQuerySchema } from "../activity";

describe("activityQuerySchema", () => {
  it("uses default days when omitted", () => {
    const result = activityQuerySchema.parse({});
    expect(result.days).toBe(30);
  });

  it("coerces days from query-string values", () => {
    const result = activityQuerySchema.parse({ days: "7" });
    expect(result.days).toBe(7);
  });

  it("rejects invalid day values instead of silently defaulting", () => {
    expect(() => activityQuerySchema.parse({ days: "0" })).toThrow();
  });

  it("accepts only supported activity types", () => {
    expect(() => activityQuerySchema.parse({ type: "review" })).toThrow();
    expect(activityQuerySchema.parse({ type: "pr" }).type).toBe("pr");
  });
});
