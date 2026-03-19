import { escapeCsvField, rowsToCsv } from "../export";

describe("escapeCsvField", () => {
  it("returns plain string unchanged when no special characters", () => {
    expect(escapeCsvField("hello")).toBe("hello");
  });

  it("returns empty string for null", () => {
    expect(escapeCsvField(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(escapeCsvField(undefined)).toBe("");
  });

  it("converts numbers to strings", () => {
    expect(escapeCsvField(42)).toBe("42");
  });

  it("wraps fields containing commas in double quotes", () => {
    expect(escapeCsvField("Smith, John")).toBe('"Smith, John"');
  });

  it("wraps fields containing newlines in double quotes", () => {
    expect(escapeCsvField("line1\nline2")).toBe('"line1\nline2"');
  });

  it("escapes double quotes by doubling them and wraps in quotes", () => {
    expect(escapeCsvField('He said "hi"')).toBe('"He said ""hi"""');
  });

  it("handles fields with both commas and quotes", () => {
    expect(escapeCsvField('"Smith, John"')).toBe('"""Smith, John"""');
  });

  it("handles empty string without quoting", () => {
    expect(escapeCsvField("")).toBe("");
  });

  it("handles zero as a number", () => {
    expect(escapeCsvField(0)).toBe("0");
  });
});

describe("rowsToCsv", () => {
  it("includes user columns when includeUsers is true", () => {
    const result = rowsToCsv(
      [
        {
          date: "2024-01-01T00:00:00.000Z",
          type: "commit",
          value: 3,
          userName: "Ada",
          userEmail: "ada@example.com",
        },
      ],
      true
    );

    expect(result).toContain("Date,Type,Value,User,Email");
    expect(result).toContain("2024-01-01T00:00:00.000Z,commit,3,Ada,ada@example.com");
  });

  it("omits user columns when includeUsers is false", () => {
    const result = rowsToCsv(
      [
        {
          date: "2024-01-01T00:00:00.000Z",
          type: "commit",
          value: 3,
        },
      ],
      false
    );

    expect(result).toContain("Date,Type,Value");
    expect(result).not.toContain("User,Email");
    expect(result).toContain("2024-01-01T00:00:00.000Z,commit,3");
  });
});
