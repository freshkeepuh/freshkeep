'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';
import { ProductCategory } from '@prisma/client'; // Update the path as needed

// Helper function to get display name for category
const getCategoryDisplayName = (category: ProductCategory): string => {
  const displayNames: Record<ProductCategory, string> = {
    [ProductCategory.Fruits]: 'Fruits',
    [ProductCategory.Vegetables]: 'Vegetables',
    [ProductCategory.CannedGoods]: 'Canned Goods',
    [ProductCategory.Dairy]: 'Dairy',
    [ProductCategory.Meat]: 'Meat',
    [ProductCategory.FishSeafood]: 'Fish & Seafood',
    [ProductCategory.Deli]: 'Deli',
    [ProductCategory.Condiments]: 'Condiments',
    [ProductCategory.Spices]: 'Spices',
    [ProductCategory.Snacks]: 'Snacks',
    [ProductCategory.Bakery]: 'Bakery',
    [ProductCategory.Beverages]: 'Beverages',
    [ProductCategory.Pasta]: 'Pasta',
    [ProductCategory.Grains]: 'Grains',
    [ProductCategory.Cereal]: 'Cereal',
    [ProductCategory.Baking]: 'Baking',
    [ProductCategory.FrozenFoods]: 'Frozen Foods',
    [ProductCategory.Other]: 'Other',
  };
  return displayNames[category];
};

export interface IProductCategoryField {
  productCategory: ProductCategory;
}

export interface ProductCategoryDropDownProps {
  register: UseFormRegister<IProductCategoryField>;
  errors: { productCategory?: { message?: string } };
  disabled?: boolean;
}

const ProductCategoryDropDown = ({ register, errors, disabled }: ProductCategoryDropDownProps) => (
  <>
    <Form.Select
      id="productCategory"
      size="lg"
      as="select"
      aria-label="Product Category"
      {...register('productCategory')}
      disabled={disabled}
      isInvalid={!!errors.productCategory}
      defaultValue={ProductCategory.Other}
    >
      {
        Object.values(ProductCategory).map((category) => (
          <option key={category} value={category}>
            {getCategoryDisplayName(category)}
          </option>
        ))
      }
    </Form.Select>
    <Form.Control.Feedback type="invalid">
      {errors.productCategory?.message}
    </Form.Control.Feedback>
  </>
);

export default ProductCategoryDropDown;
