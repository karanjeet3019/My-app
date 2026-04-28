export interface RebrandData {
  storeName: string;
  productName: string;
  productTitle: string;
  brandTone: string;
  mainColor: string;
  secondaryColor: string;
  targetAudience: string;
  price: string;
  offer: string;
  shippingTime: string;
  guarantee: string;
  mainBenefits: string;
}

export interface RemixedSection {
  type: string;
  originalDescription: string;
  newHeadline: string;
  newCopy: string;
  cta: string;
  aiImagePrompt: string;
}

export interface RemixResult {
  remixedSections: RemixedSection[];
  branding: {
    storeName: string;
    productTitle: string;
    colorPalette: string[];
    tone: string;
  };
  policyPages: {
    shipping: string;
    refund: string;
    privacy: string;
    terms: string;
  };
  adCreative: {
    metaAdCopy: string;
    tiktokScript: string;
  };
  liquidCodeSnippet: string;
}
