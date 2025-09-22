import * as Yup from 'yup';
import { ContainerType } from '@prisma/client'; // Prisma enum for container types

export const AddStorageSchema = Yup.object({
  location: Yup.string().required(),
  name: Yup.string().required(),
  type: Yup.mixed<ContainerType>()
    .oneOf(Object.values(ContainerType))
    .required(),
  picture: Yup.string().url('Must be a valid URL').required(),
  items: Yup.array().of(Yup.object({
    picture: Yup.string().url('Must be a valid URL').nullable(),
    id: Yup.string().required(),
    locId: Yup.string().required(),
    conId: Yup.string().required(),
    grocId: Yup.string().required(),
    unitId: Yup.string().required(),
    quantity: Yup.number().positive().required(),
    expiresAt: Yup.date().nullable(),
  })),
});

export const EditStorageSchema = Yup.object({
  id: Yup.string().required(),
  locId: Yup.string().required(),
  name: Yup.string().required(),
  type: Yup.mixed<ContainerType>()
    .oneOf(Object.values(ContainerType))
    .required(),
  picture: Yup.string().url('Must be a valid URL').nullable(),
  items: Yup.array().of(Yup.object({
    picture: Yup.string().url('Must be a valid URL').nullable(),
    id: Yup.string().required(),
    locId: Yup.string().required(),
    conId: Yup.string().required(),
    grocId: Yup.string().required(),
    unitId: Yup.string().required(),
    quantity: Yup.number().positive().required(),
    expiresAt: Yup.date().nullable(),
  })),
});
