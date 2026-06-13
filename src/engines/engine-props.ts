import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import type { LiquidLensReferenceFilterMaps, RefractiveOptions } from "../types";

export type LiquidEngineProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  disabled?: boolean;
  href?: string;
  ref?: Ref<HTMLElement>;
  refraction?: RefractiveOptions;
  referenceFilterMaps?: LiquidLensReferenceFilterMaps;
  type?: string;
};
