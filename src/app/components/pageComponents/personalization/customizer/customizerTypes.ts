export type ZoneId = string;

export type ElementType = "text" | "image";

export type Technique =
  | "embroidery"
  | "screenprint"
  | "dtf"
  | "dtg"
  | "rhinestones"
  | "vinyl"
  | "patch";

export type EmbroideryType =
  | "matizado"
  | "mixto"
  | "salto_puntada"
  | "bordado_3d";

export type ScreenprintType = "plana" | "puff";

export type CustomElement = {
  id: string;
  type: ElementType;
  name: string;

  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  technique: Technique;

  text?: string;
  textColor?: string;
  fontSize?: number;

  imageUrl?: string;

  embroideryType?: EmbroideryType;
  screenprintType?: ScreenprintType;
  vinylType?: string;
  rhinestonesType?: string;

  inkCount?: string;

  sizeLabel?: string;
  notes?: string;
};

export type ZoneState = {
  elements: CustomElement[];
};

export type ProductState = Record<string, ZoneState>;

export type ProductFeatureFlags = {
  hasHood?: boolean;
  hasPocket?: boolean;
  hasBackPocket?: boolean;
  hasWaistband?: boolean;
};

export type ProductZone = {
  id: string;
  label: string;
  requires?: keyof ProductFeatureFlags;
};

export type ProductType = "tshirt" | "hoodie" | "pants" | "cap";

export type ProductCustomizerBaseProps = {
  productType?: ProductType;
  productFeatures?: ProductFeatureFlags;
  zoneImages?: Record<string, string | null>;
  category?: string;
  quantity?: number;
  basePriceBreakdown?: {
    size: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  garmentBaseTotal?: number;
  onApplyCustomization?: (payload: any) => void;
  onSaveDesign?: (payload: any) => void;
};