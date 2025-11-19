'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { ProductCategory } from '@prisma/client'; // Update the path as needed
import { getProductCategoryDisplayName } from '@/lib/dbEnums';

interface ProductCategoryFilterProps {
  label?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

/**
 * ProductCategoryFilter component.
 *
 * Note: The default value for the productCategory field should be set via useForm initialization,
 * not via a prop or defaultValue on the select element. Example:
 *   useForm({ defaultValues: { productCategory: ProductCategory.Freezer } })
 */
const ProductCategoryFilter: React.FC<ProductCategoryFilterProps> = (
  {
    label = 'Storage Type',
    disabled = false,
    onChange = () => { /* no-op */ },
  },
) => {
  const [isDisabled] = React.useState(disabled);
  const context = useFormContext();
  if (!context) {
    throw new Error('ProductCategoryFilter must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && <Form.Label htmlFor="productCategoryFilter">{label}</Form.Label>}
      <Form.Select
        id="productCategoryFilter"
        size="lg"
        aria-label="Product Category Filter"
        {...register('productCategory')}
        disabled={isDisabled}
        onChange={onChange}
        isInvalid={!!errors.productCategory}
      >
        <option key="all" value="">All</option>
        {
          Object.values(ProductCategory)
            .filter((productCategory) => typeof productCategory === 'string')
            .sort()
            .map((productCategory) => (
              <option key={productCategory} value={productCategory}>
                {getProductCategoryDisplayName(productCategory as ProductCategory)}
              </option>
            ))
        }
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.productCategory ? errors.productCategory.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
};

export default ProductCategoryFilter;
