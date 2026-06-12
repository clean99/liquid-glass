import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LiquidAccordion,
  LiquidAlert,
  LiquidAlertDescription,
  LiquidAlertTitle,
  LiquidAspectRatio,
  LiquidAvatar,
  LiquidAvatarFallback,
  LiquidBadge,
  LiquidBreadcrumb,
  LiquidBreadcrumbItem,
  LiquidBreadcrumbLink,
  LiquidBreadcrumbList,
  LiquidBreadcrumbPage,
  LiquidBreadcrumbSeparator,
  LiquidButton,
  LiquidButtonGroup,
  LiquidCard,
  LiquidCheckbox,
  LiquidCollapsible,
  LiquidCollapsibleContent,
  LiquidCollapsibleTrigger,
  LiquidDirection,
  LiquidDialog,
  LiquidDialogClose,
  LiquidDialogContent,
  LiquidDialogDescription,
  LiquidDialogFooter,
  LiquidDialogHeader,
  LiquidDialogTitle,
  LiquidDialogTrigger,
  LiquidEmpty,
  LiquidEmptyDescription,
  LiquidEmptyIcon,
  LiquidEmptyTitle,
  LiquidField,
  LiquidFieldDescription,
  LiquidFieldError,
  LiquidHoverCard,
  LiquidHoverCardContent,
  LiquidHoverCardTrigger,
  LiquidIconButton,
  LiquidInput,
  LiquidInputGroup,
  LiquidItem,
  LiquidKbd,
  LiquidLens,
  LiquidLink,
  LiquidLabel,
  LiquidNav,
  LiquidNativeSelect,
  LiquidPagination,
  LiquidPaginationEllipsis,
  LiquidPaginationItem,
  LiquidPaginationLink,
  LiquidPaginationList,
  LiquidPaginationNext,
  LiquidPaginationPrevious,
  LiquidPill,
  LiquidPopover,
  LiquidPopoverClose,
  LiquidPopoverContent,
  LiquidPopoverTrigger,
  LiquidProgress,
  LiquidRadioGroup,
  LiquidScrollArea,
  LiquidSearchBox,
  LiquidProvider,
  LiquidSegmentedControl,
  LiquidSeparator,
  LiquidSlider,
  LiquidSkeleton,
  LiquidSheet,
  LiquidSheetClose,
  LiquidSheetContent,
  LiquidSheetDescription,
  LiquidSheetTitle,
  LiquidSheetTrigger,
  LiquidSpinner,
  LiquidSurface,
  LiquidTabs,
  LiquidSwitch,
  LiquidTable,
  LiquidTableBody,
  LiquidTableCaption,
  LiquidTableCell,
  LiquidTableContainer,
  LiquidTableHead,
  LiquidTableHeader,
  LiquidTableRow,
  LiquidTextarea,
  LiquidToggle,
  LiquidToolbar,
  LiquidTooltip,
  LiquidTooltipContent,
  LiquidTooltipTrigger,
  LiquidTypography,
  LiquidMusicPlayerBar,
  liquidModeStorageKey
} from "../src";

describe("Liquid components", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders LiquidButton as a native button", () => {
    render(<LiquidButton>Read Writing</LiquidButton>);

    const button = screen.getByRole("button", { name: "Read Writing" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  it("handles button clicks", () => {
    const onClick = vi.fn();
    render(<LiquidButton onClick={onClick}>View Projects</LiquidButton>);

    fireEvent.click(screen.getByRole("button", { name: "View Projects" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("blocks disabled button clicks", () => {
    const onClick = vi.fn();
    render(
      <LiquidButton disabled onClick={onClick}>
        Disabled
      </LiquidButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Disabled" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("toggles aria-pressed state", () => {
    render(<LiquidToggle>Dark mode</LiquidToggle>);

    const toggle = screen.getByRole("button", { name: "Dark mode" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("renders an icon button with an accessible name", () => {
    render(<LiquidIconButton aria-label="Toggle theme">T</LiquidIconButton>);

    expect(screen.getByRole("button", { name: "Toggle theme" })).toHaveClass("lg-icon-button");
  });

  it("renders LiquidLink as an anchor", () => {
    render(<LiquidLink href="/writing/">Writing</LiquidLink>);

    expect(screen.getByRole("link", { name: "Writing" })).toHaveAttribute("href", "/writing/");
  });

  it("renders LiquidLens as a decorative refractive surface by default", () => {
    render(<LiquidLens data-testid="lens" />);

    expect(screen.getByTestId("lens")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("lens")).toHaveClass("lg-lens");
  });

  it("renders LiquidSearchBox as a native search input", () => {
    const { container } = render(<LiquidSearchBox aria-label="Search writing" />);

    expect(screen.getByRole("searchbox", { name: "Search writing" })).toHaveClass(
      "lg-searchbox__input"
    );
    expect(container.querySelector("svg.lg-searchbox__magnifier")).toBeInTheDocument();
  });

  it("renders liquid alert title and description with status semantics", () => {
    render(
      <LiquidAlert variant="info">
        <LiquidAlertTitle>Build passed</LiquidAlertTitle>
        <LiquidAlertDescription>No critical accessibility violations.</LiquidAlertDescription>
      </LiquidAlert>
    );

    const alert = screen.getByRole("status");
    expect(alert).toHaveAttribute("data-variant", "info");
    expect(screen.getByRole("heading", { name: "Build passed" })).toHaveClass("lg-alert__title");
    expect(screen.getByText("No critical accessibility violations.")).toHaveClass(
      "lg-alert__description"
    );
  });

  it("renders badge variants without losing readable content layer", () => {
    render(<LiquidBadge variant="success">Stable</LiquidBadge>);

    const badge = screen.getByText("Stable").closest(".lg-badge");
    expect(badge).toHaveAttribute("data-variant", "success");
    expect(screen.getByText("Stable")).toHaveClass("lg-surface__content");
  });

  it("renders breadcrumb navigation with the current page", () => {
    render(
      <LiquidBreadcrumb>
        <LiquidBreadcrumbList>
          <LiquidBreadcrumbItem>
            <LiquidBreadcrumbLink href="/">Home</LiquidBreadcrumbLink>
            <LiquidBreadcrumbSeparator />
          </LiquidBreadcrumbItem>
          <LiquidBreadcrumbItem>
            <LiquidBreadcrumbPage>Writing</LiquidBreadcrumbPage>
          </LiquidBreadcrumbItem>
        </LiquidBreadcrumbList>
      </LiquidBreadcrumb>
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Writing")).toHaveAttribute("aria-current", "page");
  });

  it("renders avatar fallback content", () => {
    render(
      <LiquidAvatar size="lg">
        <LiquidAvatarFallback>KH</LiquidAvatarFallback>
      </LiquidAvatar>
    );

    expect(screen.getByText("KH")).toHaveClass("lg-avatar__fallback");
    expect(screen.getByText("KH").closest(".lg-avatar")).toHaveAttribute("data-size", "lg");
  });

  it("renders native checkbox semantics with description", () => {
    render(<LiquidCheckbox description="Included in release notes.">Publish</LiquidCheckbox>);

    const checkbox = screen.getByRole("checkbox", { name: /Publish/ });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(screen.getByText("Publish"));

    expect(checkbox).toBeChecked();
    expect(screen.getByText("Included in release notes.")).toHaveClass("lg-checkbox__description");
  });

  it("renders progress, separator, and skeleton primitives", () => {
    render(
      <>
        <LiquidProgress aria-label="Release progress" max={200} value={150} />
        <LiquidSeparator decorative={false} orientation="vertical" />
        <LiquidSkeleton data-testid="skeleton" />
      </>
    );

    const progress = screen.getByRole("progressbar", { name: "Release progress" });
    expect(progress).toHaveAttribute("aria-valuemax", "200");
    expect(progress).toHaveAttribute("aria-valuenow", "150");
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders lightweight shadcn parity primitives with native semantics", () => {
    render(
      <>
        <LiquidAspectRatio data-testid="aspect-ratio" ratio={4 / 3}>
          <img alt="Preview" src="/preview.png" />
        </LiquidAspectRatio>
        <LiquidButtonGroup aria-label="Actions">
          <LiquidButton>Save</LiquidButton>
          <LiquidButton>Share</LiquidButton>
        </LiquidButtonGroup>
        <LiquidDirection dir="rtl" data-testid="rtl">
          مرحبا
        </LiquidDirection>
        <LiquidEmpty>
          <LiquidEmptyIcon>∅</LiquidEmptyIcon>
          <LiquidEmptyTitle>No data</LiquidEmptyTitle>
          <LiquidEmptyDescription>Try another filter.</LiquidEmptyDescription>
        </LiquidEmpty>
        <LiquidInputGroup data-testid="input-group">
          <LiquidKbd>⌘K</LiquidKbd>
          <LiquidInput aria-label="Command search" />
        </LiquidInputGroup>
        <LiquidItem interactive>Open command palette</LiquidItem>
        <LiquidNativeSelect aria-label="Mode" defaultValue="fallback">
          <option value="fallback">Fallback</option>
          <option value="solid">Solid</option>
        </LiquidNativeSelect>
        <LiquidSpinner label="Loading stories" />
        <LiquidSpinner decorative data-testid="decorative-spinner" />
        <LiquidTypography variant="lead">Reference material</LiquidTypography>
      </>
    );

    expect(screen.getByTestId("aspect-ratio")).toHaveClass("lg-aspect-ratio");
    expect(screen.getByRole("img", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Actions" })).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
    expect(screen.getByTestId("rtl")).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("heading", { name: "No data" })).toHaveClass("lg-empty__title");
    expect(screen.getByText("⌘K").tagName).toBe("KBD");
    expect(screen.getByTestId("input-group")).toHaveClass("lg-input-group__inner");
    expect(screen.getByText("Open command palette")).toHaveAttribute("data-interactive");
    expect(screen.getByRole("combobox", { name: "Mode" })).toHaveClass("lg-native-select");
    expect(screen.getByRole("status", { name: "Loading stories" })).toHaveClass("lg-spinner");
    expect(screen.getByTestId("decorative-spinner")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Reference material")).toHaveAttribute("data-variant", "lead");
  });

  it("renders table, pagination, radio group, and scroll area primitives", () => {
    const onValueChange = vi.fn();
    render(
      <>
        <LiquidTableContainer>
          <LiquidTable>
            <LiquidTableCaption>Release checklist</LiquidTableCaption>
            <LiquidTableHeader>
              <LiquidTableRow>
                <LiquidTableHead>Component</LiquidTableHead>
                <LiquidTableHead>Status</LiquidTableHead>
              </LiquidTableRow>
            </LiquidTableHeader>
            <LiquidTableBody>
              <LiquidTableRow>
                <LiquidTableCell>LiquidTable</LiquidTableCell>
                <LiquidTableCell>Implemented</LiquidTableCell>
              </LiquidTableRow>
            </LiquidTableBody>
          </LiquidTable>
        </LiquidTableContainer>
        <LiquidPagination>
          <LiquidPaginationList>
            <LiquidPaginationItem>
              <LiquidPaginationPrevious aria-disabled="true" href="#previous" />
            </LiquidPaginationItem>
            <LiquidPaginationItem>
              <LiquidPaginationLink href="#page-1" isActive>
                1
              </LiquidPaginationLink>
            </LiquidPaginationItem>
            <LiquidPaginationItem>
              <LiquidPaginationEllipsis />
            </LiquidPaginationItem>
            <LiquidPaginationItem>
              <LiquidPaginationNext href="#next" />
            </LiquidPaginationItem>
          </LiquidPaginationList>
        </LiquidPagination>
        <LiquidRadioGroup
          aria-label="Release visibility"
          defaultValue="public"
          onValueChange={onValueChange}
          options={[
            { label: "Public", value: "public" },
            { label: "Private", value: "private" },
            { label: "Archived", value: "archived", disabled: true }
          ]}
        />
        <LiquidScrollArea aria-label="Scrollable release notes" maxHeight="4rem">
          <p>Readable clipped content.</p>
        </LiquidScrollArea>
      </>
    );

    expect(screen.getByRole("table", { name: "Release checklist" })).toHaveClass("lg-table");
    expect(screen.getByRole("columnheader", { name: "Component" })).toHaveAttribute("scope", "col");
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveClass("lg-pagination");
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Previous/ })).toHaveAttribute("aria-disabled", "true");

    const group = screen.getByRole("radiogroup", { name: "Release visibility" });
    expect(screen.getByRole("radio", { name: "Public" })).toBeChecked();
    fireEvent.keyDown(group, { key: "ArrowDown" });
    expect(screen.getByRole("radio", { name: "Private" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("private");
    expect(screen.getByRole("region", { name: "Scrollable release notes" })).toHaveClass(
      "lg-scroll-area"
    );
  });

  it("renders a labeled liquid input with helper text and adornments", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(
      <LiquidField>
        <LiquidLabel htmlFor="email">Email</LiquidLabel>
        <LiquidInput
          aria-describedby="email-description"
          endAdornment=".dev"
          id="email"
          placeholder="koh"
          ref={ref}
          startAdornment="@"
        />
        <LiquidFieldDescription id="email-description">
          Used for project updates.
        </LiquidFieldDescription>
      </LiquidField>
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("placeholder", "koh");
    expect(input).toHaveAttribute("aria-describedby", "email-description");
    expect(input.closest(".lg-surface")).toHaveClass("lg-input-surface");
    expect(ref.current).toBe(input);
  });

  it("exposes liquid input invalid and disabled states", () => {
    render(
      <LiquidField disabled invalid>
        <LiquidLabel htmlFor="slug">Slug</LiquidLabel>
        <LiquidInput disabled id="slug" invalid value="duplicate" readOnly />
        <LiquidFieldError id="slug-error">Slug is already used.</LiquidFieldError>
      </LiquidField>
    );

    const input = screen.getByLabelText("Slug");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.closest(".lg-field-control")).toHaveAttribute("data-invalid");
    expect(screen.getByRole("alert")).toHaveTextContent("Slug is already used.");
  });

  it("renders liquid textarea as a native textarea", () => {
    render(
      <LiquidField>
        <LiquidLabel htmlFor="message">Message</LiquidLabel>
        <LiquidTextarea id="message" placeholder="Long form note" />
      </LiquidField>
    );

    const textarea = screen.getByLabelText("Message");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveClass("lg-textarea");
    expect(textarea.closest(".lg-surface")).toHaveClass("lg-textarea-surface");
  });

  it("toggles collapsible content with labelled region semantics", async () => {
    render(
      <LiquidCollapsible>
        <LiquidCollapsibleTrigger>Implementation notes</LiquidCollapsibleTrigger>
        <LiquidCollapsibleContent>Keep content outside distorted layers.</LiquidCollapsibleContent>
      </LiquidCollapsible>
    );

    const trigger = screen.getByRole("button", { name: "Implementation notes" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Keep content outside distorted layers.")).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("region", { name: "Implementation notes" })).toHaveTextContent(
      "Keep content outside distorted layers."
    );
  });

  it("opens and closes an accessible liquid popover", async () => {
    render(
      <LiquidPopover>
        <LiquidPopoverTrigger>Mode details</LiquidPopoverTrigger>
        <LiquidPopoverContent mode="fallback">
          <h2>Fallback mode</h2>
          <p>Readable material for Safari and Firefox.</p>
          <LiquidPopoverClose>Close popover</LiquidPopoverClose>
        </LiquidPopoverContent>
      </LiquidPopover>
    );

    const trigger = screen.getByRole("button", { name: "Mode details" });
    fireEvent.click(trigger);

    const popover = await screen.findByRole("dialog", { name: "Mode details" });
    expect(popover).toHaveTextContent("Readable material for Safari and Firefox.");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(popover, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("shows tooltip and hover card through real focus/hover paths", async () => {
    render(
      <>
        <LiquidTooltip delayDuration={0}>
          <LiquidTooltipTrigger>Help</LiquidTooltipTrigger>
          <LiquidTooltipContent>Keyboard accessible hint</LiquidTooltipContent>
        </LiquidTooltip>
        <LiquidHoverCard openDelay={0}>
          <LiquidHoverCardTrigger href="#author">Author</LiquidHoverCardTrigger>
          <LiquidHoverCardContent>Systems notes and essays.</LiquidHoverCardContent>
        </LiquidHoverCard>
      </>
    );

    fireEvent.focus(screen.getByRole("button", { name: "Help" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Keyboard accessible hint");

    fireEvent.mouseEnter(screen.getByRole("link", { name: "Author" }));

    expect(await screen.findByRole("dialog")).toHaveTextContent("Systems notes and essays.");
  });

  it("renders sheet as side-mounted dialog content", async () => {
    render(
      <LiquidSheet>
        <LiquidSheetTrigger>Open settings</LiquidSheetTrigger>
        <LiquidSheetContent side="left" mode="fallback">
          <LiquidSheetTitle>Settings</LiquidSheetTitle>
          <LiquidSheetDescription>Controls for the current view.</LiquidSheetDescription>
          <LiquidSheetClose>Close settings</LiquidSheetClose>
        </LiquidSheetContent>
      </LiquidSheet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open settings" }));

    const sheet = await screen.findByRole("dialog", { name: "Settings" });
    expect(sheet).toHaveClass("lg-sheet");
    expect(sheet).toHaveAttribute("data-side", "left");
    expect(sheet).toHaveTextContent("Controls for the current view.");
  });

  it("opens and closes an accessible liquid dialog", async () => {
    const onOpenChange = vi.fn();
    render(
      <LiquidDialog onOpenChange={onOpenChange}>
        <LiquidDialogTrigger>Share</LiquidDialogTrigger>
        <LiquidDialogContent mode="fallback">
          <LiquidDialogHeader>
            <LiquidDialogTitle>Share article</LiquidDialogTitle>
            <LiquidDialogDescription>Copy a stable link to this article.</LiquidDialogDescription>
          </LiquidDialogHeader>
          <LiquidDialogFooter>
            <LiquidDialogClose>Done</LiquidDialogClose>
          </LiquidDialogFooter>
        </LiquidDialogContent>
      </LiquidDialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    const dialog = await screen.findByRole("dialog", { name: "Share article" });
    expect(dialog).toHaveTextContent("Copy a stable link to this article.");
    expect(screen.getByRole("button", { name: "Share" })).toHaveAttribute("aria-expanded", "true");
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("asks controlled liquid dialogs to close on native cancel", async () => {
    const onOpenChange = vi.fn();
    render(
      <LiquidDialog onOpenChange={onOpenChange} open>
        <LiquidDialogContent mode="fallback">
          <LiquidDialogTitle>Keyboard dismiss</LiquidDialogTitle>
        </LiquidDialogContent>
      </LiquidDialog>
    );

    const dialog = await screen.findByRole("dialog", { name: "Keyboard dismiss" });
    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders LiquidSwitch with switch semantics and toggles checked state", () => {
    render(<LiquidSwitch aria-label="Use image background" defaultChecked={false} />);

    const control = screen.getByRole("switch", { name: "Use image background" });
    expect(control).toHaveAttribute("aria-checked", "false");

    fireEvent.click(control);

    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("renders LiquidSlider as a native range input", () => {
    render(<LiquidSlider aria-label="Refraction level" defaultValue={10} />);

    const slider = screen.getByRole("slider", { name: "Refraction level" });
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveValue("10");
  });

  it("renders LiquidMusicPlayerBar content outside the displacement layer", () => {
    render(<LiquidMusicPlayerBar artist="Artist" title="Track" />);

    expect(screen.getByText("Track")).toHaveClass("lg-music-player__title");
    expect(screen.getByText("Artist")).toHaveClass("lg-music-player__artist");
  });

  it("renders nav and toolbar with required labels", () => {
    render(
      <>
        <LiquidNav aria-label="Primary navigation">
          <LiquidLink href="/">Home</LiquidLink>
        </LiquidNav>
        <LiquidToolbar aria-label="Article tools">
          <LiquidButton>Copy</LiquidButton>
        </LiquidToolbar>
      </>
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("toolbar", { name: "Article tools" })).toBeInTheDocument();
  });

  it("supports segmented control keyboard changes", () => {
    const onValueChange = vi.fn();
    render(
      <LiquidSegmentedControl
        aria-label="Theme mode"
        items={[
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
          { label: "System", value: "system" }
        ]}
        onValueChange={onValueChange}
        value="light"
      />
    );

    fireEvent.keyDown(screen.getByRole("radio", { name: "Light" }), { key: "ArrowRight" });

    expect(onValueChange).toHaveBeenCalledWith("dark");
  });

  it("renders accessible tabs and switches panels automatically with arrow keys", () => {
    render(
      <LiquidTabs
        aria-label="Content sections"
        items={[
          { label: "Overview", value: "overview", content: "Overview panel" },
          { label: "API", value: "api", content: "API panel" },
          { label: "Disabled", value: "disabled", content: "Disabled panel", disabled: true }
        ]}
      />
    );

    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    expect(screen.getByRole("tablist", { name: "Content sections" })).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
    expect(overviewTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Overview" })).toHaveTextContent("Overview panel");

    fireEvent.keyDown(overviewTab, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "API" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "API" })).toHaveTextContent("API panel");
    expect(screen.getByRole("tab", { name: "Disabled" })).toBeDisabled();
  });

  it("supports controlled manual tabs without changing value on focus movement", () => {
    const onValueChange = vi.fn();
    render(
      <LiquidTabs
        activationMode="manual"
        aria-label="Manual content sections"
        items={[
          { label: "Design", value: "design", content: "Design panel" },
          { label: "Testing", value: "testing", content: "Testing panel" }
        ]}
        onValueChange={onValueChange}
        value="design"
      />
    );

    const designTab = screen.getByRole("tab", { name: "Design" });
    fireEvent.keyDown(designTab, { key: "ArrowRight" });

    expect(onValueChange).not.toHaveBeenCalled();

    const testingTab = screen.getByRole("tab", { name: "Testing" });
    fireEvent.keyDown(testingTab, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledWith("testing");
    expect(designTab).toHaveAttribute("aria-selected", "true");
  });

  it("renders accessible accordion items and switches a single open panel", () => {
    const onValueChange = vi.fn();
    render(
      <LiquidAccordion
        defaultValue="performance"
        items={[
          { title: "Performance", value: "performance", content: "Performance panel" },
          { title: "Reliability", value: "reliability", content: "Reliability panel" }
        ]}
        onValueChange={onValueChange}
      />
    );

    const performanceTrigger = screen.getByRole("button", { name: "Performance" });
    const reliabilityTrigger = screen.getByRole("button", { name: "Reliability" });
    expect(performanceTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Performance" })).toHaveTextContent(
      "Performance panel"
    );

    fireEvent.click(reliabilityTrigger);

    expect(onValueChange).toHaveBeenCalledWith("reliability");
    expect(performanceTrigger).toHaveAttribute("aria-expanded", "false");
    expect(reliabilityTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Reliability" })).toHaveTextContent(
      "Reliability panel"
    );
    expect(screen.queryByRole("region", { name: "Performance" })).not.toBeInTheDocument();
  });

  it("supports multiple accordion panels and arrow-key focus movement", () => {
    const onValueChange = vi.fn();
    render(
      <LiquidAccordion
        defaultValue={["performance"]}
        items={[
          { title: "Performance", value: "performance", content: "Performance panel" },
          { title: "Reliability", value: "reliability", content: "Reliability panel" },
          { title: "Disabled", value: "disabled", content: "Disabled panel", disabled: true }
        ]}
        onValueChange={onValueChange}
        type="multiple"
      />
    );

    const performanceTrigger = screen.getByRole("button", { name: "Performance" });
    const reliabilityTrigger = screen.getByRole("button", { name: "Reliability" });
    performanceTrigger.focus();

    fireEvent.keyDown(performanceTrigger, { key: "ArrowDown" });
    expect(reliabilityTrigger).toHaveFocus();

    fireEvent.click(reliabilityTrigger);
    expect(onValueChange).toHaveBeenCalledWith(["performance", "reliability"]);
    expect(performanceTrigger).toHaveAttribute("aria-expanded", "true");
    expect(reliabilityTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("does not toggle disabled accordion items", () => {
    const onValueChange = vi.fn();
    render(
      <LiquidAccordion
        items={[
          { title: "Ready", value: "ready", content: "Ready panel" },
          { title: "Disabled", value: "disabled", content: "Disabled panel", disabled: true }
        ]}
        onValueChange={onValueChange}
      />
    );

    const disabledTrigger = screen.getByRole("button", { name: "Disabled" });
    expect(disabledTrigger).toBeDisabled();

    fireEvent.click(disabledTrigger);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("region", { name: "Disabled" })).not.toBeInTheDocument();
  });

  it("forwards refs and passthrough props", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <LiquidButton data-testid="ref-button" ref={ref}>
        Ref button
      </LiquidButton>
    );

    expect(ref.current).toBe(screen.getByTestId("ref-button"));
  });

  it("keeps pill text in a readable content layer", () => {
    render(<LiquidPill>这是很长的中文标签 Mixed English label</LiquidPill>);

    expect(screen.getByText("这是很长的中文标签 Mixed English label")).toHaveClass(
      "lg-surface__content"
    );
  });

  it("renders fallback mode without enhanced class", () => {
    render(
      <LiquidProvider defaultMode="fallback">
        <LiquidCard>Fallback card</LiquidCard>
      </LiquidProvider>
    );

    expect(screen.getByText("Fallback card").closest(".lg-surface")).toHaveAttribute(
      "data-liquid-mode",
      "fallback"
    );
  });

  it("lets localStorage force fallback mode", async () => {
    installChromiumMocks();
    window.localStorage.setItem(liquidModeStorageKey, "fallback");

    render(
      <LiquidProvider defaultMode="enhanced">
        <LiquidSurface mode="enhanced">Forced fallback</LiquidSurface>
      </LiquidProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Forced fallback").closest(".lg-surface")).toHaveAttribute(
        "data-liquid-mode",
        "fallback"
      )
    );
  });

  it("uses enhanced mode only when the Chromium capability checks pass", async () => {
    installChromiumMocks();

    render(
      <LiquidProvider defaultMode="enhanced">
        <LiquidSurface mode="enhanced">Enhanced surface</LiquidSurface>
      </LiquidProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Enhanced surface").closest(".lg-surface")).toHaveAttribute(
        "data-liquid-mode",
        "enhanced"
      )
    );
  });

  it("caps enhanced surfaces without triggering recursive provider updates", async () => {
    installChromiumMocks();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <LiquidProvider defaultMode="enhanced" maxEnhancedSurfaces={2}>
        <LiquidSurface>One</LiquidSurface>
        <LiquidSurface>Two</LiquidSurface>
        <LiquidSurface>Three</LiquidSurface>
      </LiquidProvider>
    );

    await waitFor(() => {
      const modes = ["One", "Two", "Three"].map((label) =>
        screen.getByText(label).closest(".lg-surface")?.getAttribute("data-liquid-mode")
      );

      expect(modes.filter((surfaceMode) => surfaceMode === "enhanced")).toHaveLength(2);
      expect(modes.filter((surfaceMode) => surfaceMode === "fallback")).toHaveLength(1);
    });
    expect(
      consoleError.mock.calls.some(([message]) =>
        String(message).includes("Maximum update depth exceeded")
      )
    ).toBe(false);
  });
});

function installChromiumMocks() {
  vi.stubGlobal("CSS", {
    supports: vi.fn((property: string, value: string) => {
      return (
        property.includes("backdrop-filter") && (value.includes("blur") || value.includes("url"))
      );
    })
  });
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe() {
        return undefined;
      }

      unobserve() {
        return undefined;
      }

      disconnect() {
        return undefined;
      }
    }
  );

  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    value:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
  });
  Object.defineProperty(window.navigator, "userAgentData", {
    configurable: true,
    value: { brands: [{ brand: "Chromium", version: "145" }] }
  });
  Object.defineProperty(window.navigator, "platform", {
    configurable: true,
    value: "MacIntel"
  });
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    configurable: true,
    value: 0
  });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
}
