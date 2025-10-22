export const unitSelect = {
  id: true,
  name: true,
  abbr: true,
  baseId: true,
  factor: true,
};

export const locationSelect = {
  id: true,
  name: true,
  address1: true,
  address2: true,
  city: true,
  state: true,
  zipcode: true,
  country: true,
  picture: true,
};

export const storageSelect = {
  id: true,
  name: true,
  type: true,
  picture: true,
};

export const productInstanceSelect = {
  id: true,
  quantity: true,
  expiresAt: true,
};

export const productSelect = {
  select: {
    id: true,
    name: true,
    brand: true,
    category: true,
    defaultQty: true,
    isNeeded: true,
    picture: true,
  },
};

export const shoppingListItemSelect = {
  select: {
    id: true,
    quantity: true,
    isPurchased: true,
  },
};

export const shoppingListSelect = {
  select: {
    id: true,
    name: true,
    isDefault: true,
  },
};

export const storeSelect = {
  id: true,
  name: true,
  address1: true,
  address2: true,
  city: true,
  state: true,
  zipcode: true,
  country: true,
  phone: true,
  website: true,
  picture: true,
};
