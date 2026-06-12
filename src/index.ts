"use client";

export { FallbackGlassSurface } from "./components/FallbackGlassSurface";
export { LiquidAccordion } from "./components/LiquidAccordion";
export { LiquidAlert, LiquidAlertDescription, LiquidAlertTitle } from "./components/LiquidAlert";
export { LiquidAspectRatio } from "./components/LiquidAspectRatio";
export { LiquidAvatar, LiquidAvatarFallback, LiquidAvatarImage } from "./components/LiquidAvatar";
export { LiquidBadge } from "./components/LiquidBadge";
export {
  LiquidBreadcrumb,
  LiquidBreadcrumbItem,
  LiquidBreadcrumbLink,
  LiquidBreadcrumbList,
  LiquidBreadcrumbPage,
  LiquidBreadcrumbSeparator
} from "./components/LiquidBreadcrumb";
export { LiquidButton } from "./components/LiquidButton";
export { LiquidButtonGroup } from "./components/LiquidButtonGroup";
export { LiquidCard } from "./components/LiquidCard";
export { LiquidCheckbox } from "./components/LiquidCheckbox";
export {
  LiquidCollapsible,
  LiquidCollapsibleContent,
  LiquidCollapsibleTrigger
} from "./components/LiquidCollapsible";
export { LiquidDirection } from "./components/LiquidDirection";
export {
  LiquidDialog,
  LiquidDialogClose,
  LiquidDialogContent,
  LiquidDialogDescription,
  LiquidDialogFooter,
  LiquidDialogHeader,
  LiquidDialogTitle,
  LiquidDialogTrigger
} from "./components/LiquidDialog";
export {
  LiquidEmpty,
  LiquidEmptyActions,
  LiquidEmptyDescription,
  LiquidEmptyIcon,
  LiquidEmptyTitle
} from "./components/LiquidEmpty";
export {
  LiquidField,
  LiquidFieldDescription,
  LiquidFieldError,
  LiquidInput,
  LiquidLabel,
  LiquidTextarea
} from "./components/LiquidField";
export {
  LiquidHoverCard,
  LiquidHoverCardContent,
  LiquidHoverCardTrigger
} from "./components/LiquidHoverCard";
export { LiquidIconButton } from "./components/LiquidIconButton";
export { LiquidInputGroup } from "./components/LiquidInputGroup";
export { LiquidItem } from "./components/LiquidItem";
export { LiquidKbd } from "./components/LiquidKbd";
export { LiquidLens } from "./components/LiquidLens";
export { LiquidLink } from "./components/LiquidLink";
export { LiquidMusicPlayerBar } from "./components/LiquidMusicPlayerBar";
export { LiquidNav } from "./components/LiquidNav";
export { LiquidNativeSelect } from "./components/LiquidNativeSelect";
export { LiquidPill } from "./components/LiquidPill";
export {
  LiquidPopover,
  LiquidPopoverClose,
  LiquidPopoverContent,
  LiquidPopoverTrigger
} from "./components/LiquidPopover";
export { LiquidProgress } from "./components/LiquidProgress";
export { LiquidSearchBox } from "./components/LiquidSearchBox";
export { LiquidSegmentedControl } from "./components/LiquidSegmentedControl";
export { LiquidSeparator } from "./components/LiquidSeparator";
export { LiquidSlider } from "./components/LiquidSlider";
export { LiquidSkeleton } from "./components/LiquidSkeleton";
export {
  LiquidSheet,
  LiquidSheetClose,
  LiquidSheetContent,
  LiquidSheetDescription,
  LiquidSheetFooter,
  LiquidSheetHeader,
  LiquidSheetTitle,
  LiquidSheetTrigger
} from "./components/LiquidSheet";
export { LiquidSpinner } from "./components/LiquidSpinner";
export { LiquidSurface } from "./components/LiquidSurface";
export { LiquidTabs } from "./components/LiquidTabs";
export { LiquidSwitch } from "./components/LiquidSwitch";
export { LiquidToggle } from "./components/LiquidToggle";
export { LiquidToolbar } from "./components/LiquidToolbar";
export {
  LiquidTooltip,
  LiquidTooltipContent,
  LiquidTooltipTrigger
} from "./components/LiquidTooltip";
export { LiquidTypography } from "./components/LiquidTypography";
export { useIsomorphicLayoutEffect } from "./hooks/use-isomorphic-layout-effect";
export { useLiquidCapabilities } from "./hooks/use-liquid-capabilities";
export { useLiquidMode } from "./hooks/use-liquid-mode";
export { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";
export { usePrefersReducedTransparency } from "./hooks/use-prefers-reduced-transparency";
export { useStableId } from "./hooks/use-stable-id";
export { LiquidProvider } from "./providers/LiquidProvider";
export { cn } from "./utils/cn";
export {
  clampLensPosition,
  resolveLensDragPosition,
  resolveLensDropletResponse
} from "./utils/draggable-lens";
export { distanceFromRectEdge, resolveLiquidElasticResponse } from "./utils/elasticity";
export { sampleLiquidEdgeMask, sampleLiquidEdgeMaskRamp } from "./utils/edge-mask";
export {
  createLensDisplacementPixelMap,
  createLensFilterPixelMaps,
  createLensSpecularPixelMap,
  sampleCapsuleField
} from "./utils/displacement-map";
export {
  referenceLensDisplacementRefraction,
  referenceLensGeometry,
  resolveLensReferencePipeline,
  type LensPipeline,
  type LensPipelineStage
} from "./utils/lens-pipeline";
export {
  calculateDisplacementMagnitudes,
  estimateMaximumDisplacement,
  sampleOpticalSurface,
  type DisplacementEstimateOptions,
  type OpticalSurfaceProfile
} from "./utils/optics";
export {
  continuousPlateRefraction,
  defaultRefractionByIntensity,
  resolveFilterMapGeometry,
  resolvePhysicalRefractionRadius,
  resolveRefractiveOptions,
  resolveRefractionRadius
} from "./utils/refraction";
export {
  getBrowserCapabilities,
  isProbablyLowPowerMobile,
  readStoredLiquidMode,
  resolveLiquidMode,
  shouldReduceMotion,
  shouldReduceTransparency,
  shouldUseEnhancedLiquidGlass,
  supportsBackdropFilter,
  supportsSvgBackdropFilter
} from "./utils/support";
export { surfaceClassNames } from "./utils/variants";

export const liquidPackageName = "@clean99/liquid-glass";

export type {
  LiquidAccordionItem,
  LiquidAccordionProps,
  LiquidAccordionSurfaceProps,
  LiquidAccordionType,
  LiquidAccordionValue
} from "./components/LiquidAccordion";
export type {
  LiquidAlertDescriptionProps,
  LiquidAlertProps,
  LiquidAlertTitleProps,
  LiquidAlertVariant
} from "./components/LiquidAlert";
export type { LiquidAspectRatioProps } from "./components/LiquidAspectRatio";
export type {
  LiquidAvatarFallbackProps,
  LiquidAvatarImageProps,
  LiquidAvatarProps
} from "./components/LiquidAvatar";
export type { LiquidBadgeProps, LiquidBadgeVariant } from "./components/LiquidBadge";
export type {
  LiquidBreadcrumbItemProps,
  LiquidBreadcrumbLinkProps,
  LiquidBreadcrumbListProps,
  LiquidBreadcrumbPageProps,
  LiquidBreadcrumbProps,
  LiquidBreadcrumbSeparatorProps
} from "./components/LiquidBreadcrumb";
export type { LiquidButtonProps } from "./components/LiquidButton";
export type { LiquidButtonGroupProps } from "./components/LiquidButtonGroup";
export type { LiquidCardProps } from "./components/LiquidCard";
export type { LiquidEdgeMaskOptions, LiquidEdgeMaskSample } from "./utils/edge-mask";
export type {
  LiquidCapsuleFieldSample,
  LiquidLensFilterPixelMaps,
  LiquidLensPixelMapOptions,
  LiquidPixelMap
} from "./utils/displacement-map";
export type { LiquidCheckboxProps, LiquidCheckboxSurfaceProps } from "./components/LiquidCheckbox";
export type {
  LiquidCollapsibleContentProps,
  LiquidCollapsibleProps,
  LiquidCollapsibleTriggerProps
} from "./components/LiquidCollapsible";
export type { LiquidDirectionProps } from "./components/LiquidDirection";
export type {
  LiquidDialogCloseProps,
  LiquidDialogContentProps,
  LiquidDialogDescriptionProps,
  LiquidDialogFooterProps,
  LiquidDialogHeaderProps,
  LiquidDialogProps,
  LiquidDialogTitleProps,
  LiquidDialogTriggerProps
} from "./components/LiquidDialog";
export type {
  LiquidEmptyActionsProps,
  LiquidEmptyDescriptionProps,
  LiquidEmptyIconProps,
  LiquidEmptyProps,
  LiquidEmptyTitleProps
} from "./components/LiquidEmpty";
export type {
  LiquidFieldDescriptionProps,
  LiquidFieldErrorProps,
  LiquidFieldProps,
  LiquidInputProps,
  LiquidInputSurfaceProps,
  LiquidLabelProps,
  LiquidTextareaProps
} from "./components/LiquidField";
export type {
  LiquidHoverCardContentProps,
  LiquidHoverCardProps,
  LiquidHoverCardTriggerProps
} from "./components/LiquidHoverCard";
export type { LiquidIconButtonProps } from "./components/LiquidIconButton";
export type { LiquidInputGroupProps } from "./components/LiquidInputGroup";
export type { LiquidItemProps } from "./components/LiquidItem";
export type { LiquidKbdProps } from "./components/LiquidKbd";
export type { LiquidLensProps } from "./components/LiquidLens";
export type { LiquidLinkProps } from "./components/LiquidLink";
export type { LiquidMusicPlayerBarProps } from "./components/LiquidMusicPlayerBar";
export type { LiquidNavProps } from "./components/LiquidNav";
export type { LiquidNativeSelectProps } from "./components/LiquidNativeSelect";
export type { LiquidPillProps } from "./components/LiquidPill";
export type {
  LiquidPopoverCloseProps,
  LiquidPopoverContentProps,
  LiquidPopoverProps,
  LiquidPopoverTriggerProps
} from "./components/LiquidPopover";
export type { LiquidProgressProps } from "./components/LiquidProgress";
export type { LiquidSearchBoxProps } from "./components/LiquidSearchBox";
export type {
  LiquidSegmentedControlItem,
  LiquidSegmentedControlProps
} from "./components/LiquidSegmentedControl";
export type { LiquidSeparatorProps } from "./components/LiquidSeparator";
export type { LiquidSurfaceProps } from "./components/LiquidSurface";
export type { LiquidSkeletonProps } from "./components/LiquidSkeleton";
export type {
  LiquidSheetCloseProps,
  LiquidSheetContentProps,
  LiquidSheetDescriptionProps,
  LiquidSheetFooterProps,
  LiquidSheetHeaderProps,
  LiquidSheetProps,
  LiquidSheetSide,
  LiquidSheetTitleProps,
  LiquidSheetTriggerProps
} from "./components/LiquidSheet";
export type { LiquidSpinnerProps } from "./components/LiquidSpinner";
export type {
  LiquidTabsItem,
  LiquidTabsProps,
  LiquidTabsSurfaceProps
} from "./components/LiquidTabs";
export type { LiquidSliderProps } from "./components/LiquidSlider";
export type { LiquidSwitchProps } from "./components/LiquidSwitch";
export type { LiquidToggleProps } from "./components/LiquidToggle";
export type { LiquidToolbarProps } from "./components/LiquidToolbar";
export type {
  LiquidTooltipContentProps,
  LiquidTooltipProps,
  LiquidTooltipTriggerProps
} from "./components/LiquidTooltip";
export type { LiquidTypographyProps, LiquidTypographyVariant } from "./components/LiquidTypography";
export type { BrowserCapabilities, BrowserCapabilityEnvironment } from "./utils/support";
export type {
  LiquidLensBounds,
  LiquidLensDragState,
  LiquidLensDropletOptions,
  LiquidLensDropletPhase,
  LiquidLensDropletResponse,
  LiquidLensPoint,
  LiquidLensRect,
  LiquidLensSize
} from "./utils/draggable-lens";
export type {
  LiquidFallback,
  LiquidIntensity,
  LiquidMode,
  LiquidProviderProps,
  LiquidRadius,
  LiquidSurfaceKind,
  RefractiveOptions,
  ResolvedLiquidMode
} from "./types";
export type {
  LiquidElasticOptions,
  LiquidElasticPoint,
  LiquidElasticRect,
  LiquidElasticResponse
} from "./utils/elasticity";
export { isLiquidMode, liquidModeStorageKey, liquidModes } from "./types";
