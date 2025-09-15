import { Unit } from '@prisma/client';

/**
 * Converts the From Unit/Qty to the To Unit.
 * @param fromUnit The From Unit
 * @param fromQty The From Quanity
 * @param toUnit The To Unit
 * @returns The Quantity in the To Unit
 */
const unitConverter = ({
  fromUnit,
  fromQty,
  toUnit,
}: {
  fromUnit: Unit,
  fromQty: number,
  toUnit: Unit,
}): number => {
  if (fromUnit.id === toUnit.id) {
    return fromQty;
  }
  return fromQty * (fromUnit.factor / toUnit.factor);
};

export default unitConverter;
