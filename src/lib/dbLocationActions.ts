/**
 * CRUD Actions for the Location Model.
 */

'use server';

import { instanceSelect } from "./dbProductActions";

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

export const locationWithInstancesSelect = {
  ...locationSelect,
  instances: instanceSelect,
};