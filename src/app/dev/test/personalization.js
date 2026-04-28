import { resolveChargedSize } from "../../components/pageComponents/personalization/availability/sizeNormalization.config.js";
import { calculatePlacementPrice } from "../../components/pageComponents/personalization/pricing/calculatePlacementPrice.js";
import { getQuantityBracket } from "../../components/pageComponents/personalization/pricing/quantityBrackets.js";

function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

function logResult(label, value) {
  console.log(`${label}:`, JSON.stringify(value, null, 2));
}

logSection("1. Normalización de tamaños VINILO");

const sizeCases = [
  "5x5",
  "5x10",
  "10x10",
  "10x15",
  "15x20",
  "20x30",
  "30x40",
  "40x30",
  "30x20",
  "20x15",
  "15x10",
  "10x20",
  "10x30",
  "10x40",
  "20x27",
  "5x7.5",
];

for (const requestedSize of sizeCases) {
  logResult(
    `resolveChargedSize("${requestedSize}")`,
    resolveChargedSize({
      productType: "tshirt",
      view: "front",
      technique: "vinyl",
      requestedSize,
    })
  );
}

logSection("2. Tramos de cantidad");

[10, 12, 15, 26, 50, 520, 1000].forEach((qty) => {
  console.log(`Cantidad ${qty} -> tramo ${getQuantityBracket(qty)}`);
});

logSection("3. Cálculo automático VINILO");

const cases = [
  {
    label: "Vinilo Textil Flex 5x5 - 10 uds",
    input: {
      productType: "tshirt",
      view: "front",
      technique: "vinyl",
      variant: "textil_flex",
      requestedSize: "5x5",
      quantity: 10,
    },
  },
  {
    label: "Vinilo Glitter 10x20 - 25 uds (debe mapear a 15x20)",
    input: {
      productType: "tshirt",
      view: "front",
      technique: "vinyl",
      variant: "glitter",
      requestedSize: "10x20",
      quantity: 25,
    },
  },
  {
    label: "Vinilo Brick 600 40x30 - 50 uds (debe mapear a 30x40)",
    input: {
      productType: "tshirt",
      view: "front",
      technique: "vinyl",
      variant: "brick_600",
      requestedSize: "40x30",
      quantity: 50,
    },
  },
  {
    label: "Vinilo Reflectante 5x7.5 - 100 uds (debe mapear a 5x10)",
    input: {
      productType: "tshirt",
      view: "front",
      technique: "vinyl",
      variant: "reflectante",
      requestedSize: "5x7.5",
      quantity: 100,
    },
  },
  {
    label: "Vinilo Electric/Holografic 30x40 - 1000 uds",
    input: {
      productType: "tshirt",
      view: "front",
      technique: "vinyl",
      variant: "electric_holografic",
      requestedSize: "30x40",
      quantity: 1000,
    },
  },
];

for (const testCase of cases) {
  logResult(testCase.label, calculatePlacementPrice(testCase.input));
}

logSection("4. Casos manual_quote / inválidos");

logResult(
  "Variante no soportada",
  calculatePlacementPrice({
    productType: "tshirt",
    view: "front",
    technique: "vinyl",
    variant: "vinilo_raro",
    requestedSize: "10x10",
    quantity: 50,
  })
);

logResult(
  "Tamaño sin precio",
  calculatePlacementPrice({
    productType: "tshirt",
    view: "front",
    technique: "vinyl",
    variant: "textil_flex",
    requestedSize: "99x99",
    quantity: 50,
  })
);

logResult(
  "Sin variante",
  calculatePlacementPrice({
    productType: "tshirt",
    view: "front",
    technique: "vinyl",
    variant: "",
    requestedSize: "10x10",
    quantity: 50,
  })
);

console.log(`
VERIFICACIONES:
- 40x30 debe devolver chargedSize = "30x40"
- 30x20 debe devolver chargedSize = "20x30"
- 20x15 debe devolver chargedSize = "15x20"
- 15x10 debe devolver chargedSize = "10x15"
- 10x20 debe devolver chargedSize = "15x20"
- 10x30 debe devolver chargedSize = "20x30"
- 10x40 debe devolver chargedSize = "30x40"
- 5x7.5 debe devolver chargedSize = "5x10"
- Las variantes válidas deben devolver pricingMode = "automatic"
- Las variantes no soportadas deben devolver manual_quote
`);