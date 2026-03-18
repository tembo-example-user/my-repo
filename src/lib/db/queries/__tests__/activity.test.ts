import { aggregateActivityByDate } from "../activity";

describe("aggregateActivityByDate", () => {
  it("aggregates multiple commits on the same date into a single data point", () => {
    const logs = [
      { action: "commit", createdAt: new Date("2024-03-15T10:00:00Z") },
      { action: "commit", createdAt: new Date("2024-03-15T14:00:00Z") },
      { action: "commit", createdAt: new Date("2024-03-15T16:00:00Z") },
    ];

    const result = aggregateActivityByDate(logs);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: "2024-03-15",
      commits: 3,
      prs: 0,
      user: "",
    });
  });

  it("aggregates commits and PRs on the same date separately", () => {
    const logs = [
      { action: "commit", createdAt: new Date("2024-03-15T10:00:00Z") },
      { action: "pr_merged", createdAt: new Date("2024-03-15T11:00:00Z") },
      { action: "commit", createdAt: new Date("2024-03-15T12:00:00Z") },
      { action: "pr_merged", createdAt: new Date("2024-03-15T13:00:00Z") },
    ];

    const result = aggregateActivityByDate(logs);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: "2024-03-15",
      commits: 2,
      prs: 2,
      user: "",
    });
  });

  it("returns separate data points for different dates", () => {
    const logs = [
      { action: "commit", createdAt: new Date("2024-03-15T10:00:00Z") },
      { action: "commit", createdAt: new Date("2024-03-16T10:00:00Z") },
      { action: "pr_merged", createdAt: new Date("2024-03-17T10:00:00Z") },
    ];

    const result = aggregateActivityByDate(logs);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ date: "2024-03-15", commits: 1, prs: 0, user: "" });
    expect(result[1]).toEqual({ date: "2024-03-16", commits: 1, prs: 0, user: "" });
    expect(result[2]).toEqual({ date: "2024-03-17", commits: 0, prs: 1, user: "" });
  });

  it("sorts results by date ascending", () => {
    const logs = [
      { action: "commit", createdAt: new Date("2024-03-17T10:00:00Z") },
      { action: "commit", createdAt: new Date("2024-03-15T10:00:00Z") },
      { action: "commit", createdAt: new Date("2024-03-16T10:00:00Z") },
    ];

    const result = aggregateActivityByDate(logs);

    expect(result.map((r) => r.date)).toEqual([
      "2024-03-15",
      "2024-03-16",
      "2024-03-17",
    ]);
  });

  it("ignores unknown action types (no commits or prs counted)", () => {
    const logs = [
      { action: "comment", createdAt: new Date("2024-03-15T10:00:00Z") },
      { action: "review", createdAt: new Date("2024-03-15T11:00:00Z") },
    ];

    const result = aggregateActivityByDate(logs);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ date: "2024-03-15", commits: 0, prs: 0, user: "" });
  });

  it("returns empty array for empty logs", () => {
    const result = aggregateActivityByDate([]);
    expect(result).toEqual([]);
  });
});
