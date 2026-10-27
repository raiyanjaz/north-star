import { test, expect } from "@playwright/test";
import { mockWorkspace } from "./fixture";

test("map stays full-screen and marker selection opens a contextual floating panel", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await mockWorkspace(page);
  await expect(page.locator("#map")).toHaveCSS("width", "1440px");
  await expect(page.locator("#map")).toHaveCSS("height", "1000px");
  await page.getByRole("button", { name: "Medic 52", exact: true }).click();
  await expect(page.locator(".detail-panel h2")).toHaveText("Medic 52");
  await expect(page.getByText("643 Eglinton Ave W")).toBeVisible();
  await page.getByRole("button", { name: "Collapse Medic 52" }).click();
  await expect(page.locator(".detail-panel .panel-content")).toBeHidden();
  await page.getByRole("button", { name: "Expand Medic 52" }).click();
  await expect(page.getByText("643 Eglinton Ave W")).toBeVisible();
  await page.getByRole("button", { name: "Close Medic 52" }).click();
  await expect(page.locator(".detail-panel")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Selected case", exact: true })
    .click();
  await expect(page.locator(".detail-panel h2")).toHaveText("King & Church");
  await expect(
    page.getByRole("button", { name: "Approve plan", exact: true }),
  ).toBeEnabled();
  expect(errors).toEqual([]);
});

test("drafts and expanded evidence survive polling, panel changes and case switches", async ({
  page,
}) => {
  await mockWorkspace(page);
  await page.getByText("Response details · ready", { exact: true }).click();
  await page.getByLabel("Dispatcher notes").fill("Keep this unsaved note");
  await page.locator('[data-incident="CASE-2"]').click();
  await page.locator('[data-incident="CASE-1"]').click();
  await expect(page.getByLabel("Dispatcher notes")).toHaveValue(
    "Keep this unsaved note",
  );
  await page.getByRole("button", { name: "Resources", exact: true }).click();
  await page
    .getByRole("button", { name: "Selected case", exact: true })
    .click();
  await expect(page.getByLabel("Dispatcher notes")).toHaveValue(
    "Keep this unsaved note",
  );
  await page.waitForTimeout(2200);
  await expect(page.getByLabel("Dispatcher notes")).toHaveValue(
    "Keep this unsaved note",
  );
});

test("pickup choice and intake use the existing revision-scoped payload", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  await page.getByText("Response details · ready", { exact: true }).click();
  await page.getByRole("button", { name: "Choose pickup on map" }).click();
  await page.locator("#map").click({ position: { x: 700, y: 350 } });
  await expect(page.getByText("Click a pickup point on the map")).toHaveCount(
    0,
  );
  const lat = await page.getByLabel("Pickup latitude").inputValue();
  expect(Number(lat)).toBeGreaterThan(43.4);
  await page.getByLabel("Dispatcher notes").fill("Confirmed pickup");
  await page
    .getByRole("button", { name: "Confirm & let ARC continue" })
    .click();
  await expect
    .poll(
      () =>
        mock.requests.find((r) => r.path === "/api/incidents/details")?.body,
    )
    .toMatchObject({
      incident_id: "CASE-1",
      revision: 2,
      notes: "Confirmed pickup",
      lat,
    });
});

test("stale intake retains the draft and offers an explicit reload", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  await page.getByText("Response details · ready", { exact: true }).click();
  await page.getByLabel("Dispatcher notes").fill("Unsaved");
  mock.state.incidents[0].incident_revision = 3;
  await page
    .getByRole("button", { name: "Confirm & let ARC continue" })
    .click();
  await expect(
    page
      .getByRole("alert")
      .getByText("Incident changed. Reload current details."),
  ).toBeVisible();
  await expect(page.getByLabel("Dispatcher notes")).toHaveValue("Unsaved");
  await page
    .getByRole("button", { name: "Discard draft and load current details" })
    .click();
  await expect(page.getByLabel("Dispatcher notes")).toHaveValue("");
});

test("approval and assignment progression preserve the API contract", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  await page.getByRole("button", { name: "Approve plan", exact: true }).click();
  await expect
    .poll(() => mock.requests[0])
    .toMatchObject({
      path: "/api/decision",
      body: { id: "REC-1", action: "approve" },
    });
  await expect(
    page.getByRole("heading", { name: "Journey progress" }),
  ).toBeVisible();
  await page.getByText("Journey controls", { exact: true }).click();
  await page
    .getByRole("button", { name: "Advance to responding to pickup" })
    .click();
  await expect
    .poll(
      () =>
        mock.requests.find((r) => r.path === "/api/assignments/progress")?.body,
    )
    .toEqual({ id: "ASSIGN-1", revision: 0, action: "advance" });
  await page
    .getByRole("button", { name: "End exercise assignment", exact: true })
    .click();
  await expect(
    page.getByText(
      "The unit and receiving slot were released. The unit stays at its last journey location.",
    ),
  ).toBeVisible();
});

test("expired, changed and disconnected plans cannot be approved", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  mock.rec.evidence_epoch = Date.now() / 1000 - 130;
  await expect(
    page.getByRole("button", { name: "Approve plan", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".decision-heading")).toContainText(
    "Evidence expired",
  );
  mock.rec.evidence_epoch = Date.now() / 1000;
  mock.state.version++;
  await expect(page.locator(".decision-heading")).toContainText(
    "Review required",
  );
  mock.rec.version = mock.state.version;
  await expect(
    page.getByRole("button", { name: "Approve plan", exact: true }),
  ).toBeEnabled();
  mock.setOffline(true);
  await expect(
    page.getByRole("button", { name: "Approve plan", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("alert")).toContainText("Connection lost");
});

test("alternative assessment stays attached to its case while browsing another case", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  await page.getByText("Compare options", { exact: true }).click();
  await page
    .getByRole("button", { name: "Ask ARC to review this option" })
    .click();
  await expect
    .poll(() => mock.requests[0])
    .toMatchObject({
      path: "/api/alternative",
      body: { recommendation_id: "REC-1", pair_id: "UNIT-2:H-1" },
    });
  await page.locator('[data-incident="CASE-2"]').click();
  mock.finishJob();
  await page.waitForTimeout(1600);
  await expect(page.locator(".detail-panel h2")).toHaveText(
    "College & Spadina",
  );
  await expect(
    page.getByRole("button", { name: "Approve plan", exact: true }),
  ).toHaveCount(0);
});

test("agent, workspace controls, context and evidence remain available", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  await page.getByRole("button", { name: "Pause agent" }).click();
  await expect(
    page.getByRole("button", { name: "Resume agent" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Workspace controls", exact: true })
    .click();
  await page.getByLabel("Exercise journey speed").selectOption("30");
  await expect
    .poll(() =>
      mock.requests.some(
        (r) => r.path === "/api/journeys/speed" && r.body.speed === 30,
      ),
    )
    .toBe(true);
  await page
    .getByRole("button", {
      name: "Hospital unavailable Proposed destination stops accepting transfers.",
    })
    .click();
  await expect
    .poll(() =>
      mock.requests.some(
        (r) => r.path === "/api/scenario" && r.body.incident_id === "CASE-1",
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Layers", exact: true }).click();
  await page.getByLabel("Ambulance stations", { exact: true }).check();
  await page.getByLabel("Source", { exact: true }).selectOption("stations");
  await page.getByRole("button", { name: "Inspect on map" }).click();
  await expect(page.locator(".detail-panel h2")).toHaveText("Station 18");
  await page
    .getByRole("button", { name: "System details", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Meterless World Model" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Refresh public road context" })
    .click();
  await expect
    .poll(() => mock.requests.some((r) => r.path === "/api/roads/refresh"))
    .toBe(true);
});

for (const [width, height] of [
  [320, 640],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
])
  test(`responsive layout ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await mockWorkspace(page);
    if (width <= 760)
      await page
        .getByRole("button", { name: "Selected case", exact: true })
        .click();
    await expect(
      page.getByRole("button", { name: "Approve plan", exact: true }),
    ).toBeEnabled();
    const boxes = await page
      .locator(
        ".floating-panel,.workspace-header,.workspace-utilities,.workspace-nav,.agent-bar",
      )
      .evaluateAll((es) =>
        es.map((e) => ({
          name: e.className,
          x: e.getBoundingClientRect().x,
          y: e.getBoundingClientRect().y,
          right: e.getBoundingClientRect().right,
          bottom: e.getBoundingClientRect().bottom,
          overflow: e.scrollWidth > e.clientWidth + 1,
        })),
      );
    for (const b of boxes) {
      expect(b.x, b.name).toBeGreaterThanOrEqual(0);
      expect(b.y, b.name).toBeGreaterThanOrEqual(0);
      expect(b.right, b.name).toBeLessThanOrEqual(width);
      expect(b.bottom, b.name).toBeLessThanOrEqual(height);
      expect(b.overflow, b.name).toBe(false);
    }
    const header = boxes.find((b) => b.name === "workspace-header")!,
      utilities = boxes.find((b) => b.name === "workspace-utilities")!;
    expect(header.right).toBeLessThanOrEqual(utilities.x);
    const detail = boxes.find((b) => b.name.includes("detail-panel"))!,
      agent = boxes.find((b) => b.name === "agent-bar")!;
    expect(
      detail.right <= agent.x ||
        detail.x >= agent.right ||
        detail.bottom <= agent.y,
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/private/arc-layout-${width}.png`,
    });
    expect(errors).toEqual([]);
  });

test("background refresh preserves the user’s map position and map instance", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  await page.getByRole("button", { name: "Close Work with ARC" }).click();
  await page.getByRole("button", { name: "Close King & Church" }).click();
  await page.mouse.move(700, 400);
  await page.mouse.down();
  await page.mouse.move(900, 500, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  await page
    .locator("#map")
    .evaluate((e) => e.setAttribute("data-instance", "original"));
  const before = await page
    .locator(".leaflet-map-pane")
    .evaluate((e) => (e as HTMLElement).style.transform);
  mock.rec.id = "REC-2";
  await page.waitForTimeout(2300);
  await expect(page.locator("#map")).toHaveAttribute(
    "data-instance",
    "original",
  );
  expect(
    await page
      .locator(".leaflet-map-pane")
      .evaluate((e) => (e as HTMLElement).style.transform),
  ).toBe(before);
});

test("public reports remain separate and keyboard selection opens the matching case", async ({
  page,
}) => {
  await mockWorkspace(page);
  await page
    .getByRole("button", { name: "Public reports 1", exact: true })
    .click();
  await page.locator('[data-incident="REPORT-1"]').click();
  await expect(page.locator(".detail-panel h2")).toHaveText(
    "Queen Street report",
  );
  await expect(
    page.getByRole("button", { name: "Approve plan", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Confirm this response case" })
    .click();
  await expect(page.getByLabel("Required service")).toBeVisible();
  await page
    .getByRole("button", { name: "Public reports 1", exact: true })
    .click();
  await page.locator('[data-incident="CASE-1"]').focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator(".detail-panel h2")).toHaveText(
    "College & Spadina",
  );
});

test("Seattle requests retain city scoping and city-specific controls", async ({
  page,
}) => {
  const urls: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/")) urls.push(r.url());
  });
  await mockWorkspace(page, "seattle");
  await expect(page.getByLabel("City workspace")).toHaveValue("seattle");
  await page.getByRole("button", { name: "Layers", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: "Ambulance stations", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.locator('select[aria-label="Source"] option[value="police"]'),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Pause agent" }).click();
  expect(urls.length).toBeGreaterThan(2);
  expect(
    urls.every((url) => new URL(url).searchParams.get("city") === "seattle"),
  ).toBe(true);
});

test("mobile pickup selection collapses the sheet and restores the saved draft", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockWorkspace(page);
  await page
    .getByRole("button", { name: "Selected case", exact: true })
    .click();
  await page.getByText("Response details · ready", { exact: true }).click();
  await page.getByRole("button", { name: "Choose pickup on map" }).click();
  await expect(page.locator(".detail-panel")).toHaveClass(/is-collapsed/);
  await page.locator("#map").click({ position: { x: 180, y: 300 } });
  await expect(page.locator(".detail-panel")).not.toHaveClass(/is-collapsed/);
  await expect(page.getByLabel("Pickup latitude")).not.toHaveValue("43.649");
});

test("closing panels preserves inbox filters and assessment instructions", async ({
  page,
}) => {
  const mock = await mockWorkspace(page);
  await page
    .getByRole("button", { name: "Public reports 1", exact: true })
    .click();
  await page.getByRole("button", { name: "Close Work with ARC" }).click();
  await page.getByRole("button", { name: "Inbox 1", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Public reports 1", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByText("Ask ARC to review this case", { exact: true }).click();
  await page
    .getByLabel("Add an instruction")
    .fill("Prioritize a pediatric receiving facility.");
  await page.getByRole("button", { name: "Resources", exact: true }).click();
  await page
    .getByRole("button", { name: "Selected case", exact: true })
    .click();
  await expect(page.getByLabel("Add an instruction")).toHaveValue(
    "Prioritize a pediatric receiving facility.",
  );
  await page.getByRole("button", { name: "Reassess now", exact: true }).click();
  await expect
    .poll(() => mock.requests.find((r) => r.path === "/api/agent/retry")?.body)
    .toEqual({
      incident_id: "CASE-1",
      request: "Prioritize a pediatric receiving facility.",
    });
});

test("focus fits the selected marker into the exposed map area", async ({
  page,
}) => {
  await mockWorkspace(page);
  await page.getByRole("button", { name: "Focus selected case" }).click();
  const marker = await page
    .getByRole("button", { name: "King & Church", exact: true })
    .boundingBox();
  const left = await page.locator(".inbox-panel").boundingBox(),
    right = await page.locator(".detail-panel").boundingBox();
  expect(marker!.x).toBeGreaterThan(left!.x + left!.width);
  expect(marker!.x + marker!.width).toBeLessThan(right!.x);
});

for (const width of [768, 1024])
  test(`focus avoids floating panels at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockWorkspace(page);
    await page.getByRole("button", { name: "Focus selected case" }).click();
    const marker = await page
      .getByRole("button", { name: "King & Church", exact: true })
      .boundingBox();
    const left = await page.locator(".inbox-panel").boundingBox(),
      right = await page.locator(".detail-panel").boundingBox();
    expect(marker!.x).toBeGreaterThan(left!.x + left!.width);
    expect(marker!.x + marker!.width).toBeLessThan(right!.x);
  });
