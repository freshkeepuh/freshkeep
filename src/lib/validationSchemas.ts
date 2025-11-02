import * as Yup from 'yup';
import { ContainerType, Country } from '@prisma/client';
import { checkUser } from './dbUserActions';

export const forgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .test('unique-email', 'Email not found', async (value) => {
      if (!value) return false;
      return (checkUser({ email: value }));
    }),
});

export const signUpValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid')
    .test('unique-email', 'Email already in use', async (value) => {
      if (!value) return false;
      return !(await checkUser({ email: value }));
    }),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export const signInValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
}); // Prisma enum for container types

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
    storId: Yup.string().required(),
    prodId: Yup.string().required(),
    grocId: Yup.string().required(),
    unitId: Yup.string().required(),
    quantity: Yup.number().positive().required(),
    expiresAt: Yup.date().nullable(),
  })),
});

export const AddLocationSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Name is required'),
  address1: Yup.string().required('Address is required'),
  address2: Yup.string().nullable(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip code is required'),
  country: Yup.mixed<Country>().oneOf(Object.values(Country)).required('Country is required'),
  picture: Yup.string().url('Must be a valid URL').nullable(),
  containers: Yup.array().of(Yup.mixed<ContainerType>().oneOf(Object.values(ContainerType))),
  instances: Yup.array().of(Yup.object({
    picture: Yup.string().url('Must be a valid URL').nullable(),
    id: Yup.string().required(),
    locId: Yup.string().required(),
    prodId: Yup.string().required(),
    storId: Yup.string().required(),
    grocId: Yup.string().required(),
    unitId: Yup.string().required(),
    quantity: Yup.number().positive().required(),
    expiresAt: Yup.date().nullable(),
  })),
  createdAt: Yup.date().required(),
  updatedAt: Yup.date().required(),
});

/**
 * Validation schema for Store form.
 */
export const storeValidation = Yup.object().shape({
  id: Yup.string().optional(),
  name: Yup.string()
    .required('Store name is required')
    .max(100, 'Store name must not exceed 100 characters'),
  address1: Yup.string()
    .required('Address 1 is required')
    .max(100, 'Address 1 must not exceed 100 characters'),
  address2: Yup.string()
    .max(100, 'Address 2 must not exceed 100 characters'),
  city: Yup.string()
    .required('City is required')
    .max(50, 'City must not exceed 50 characters'),
  state: Yup.string()
    .required('State is required')
    .max(50, 'State must not exceed 50 characters'),
  zipcode: Yup.string()
    .required('Zipcode is required')
    .max(20, 'Zipcode must not exceed 20 characters'),
  country: Yup.mixed<Country>()
    .required('Country is required'),
  phone: Yup.string()
    .optional()
    .max(20, 'Phone number must not exceed 20 characters'),
  website: Yup.string()
    .optional()
    .url('Website must be a valid URL')
    .max(256, 'Website must not exceed 256 characters'),
  picture: Yup.string()
    .optional()
    .max(256, 'Picture must not exceed 256 characters'),
});
