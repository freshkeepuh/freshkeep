/**
 * CRUD Actions for the Storage Model.
 */

'use server';

import { instanceSelect } from "./dbProductActions";

export const storageSelect = {
  id: true,
  name: true,
  type: true,
  picture: true,
};

export const storageWithInstancesSelect = {
  ...storageSelect,
  instances: instanceSelect,
};