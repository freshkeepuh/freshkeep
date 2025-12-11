'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { ProductCategory } from '@prisma/client'; // Update the path as needed
import { getProductCategoryDisplayName } from '@/lib/dbEnums';
import RequiredLabel from '@/components/RequiredLabel';

interface ProductCategoryDropDownProps {
  label: string;
  disabled: boolean;
  required: boolean;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

/**
 * ProductCategoryDropDown component.
 *
 * Note: The default value for the productCategory field should be set via useForm initialization,
 * not via a prop or defaultValue on the select element. Example:
 *   useForm({ defaultValues: { productCategory: ProductCategory.Food } })
 */
function ProductCategoryDropDown({
  label = 'Product Category',
  disabled = false,
  required = false,
  onChange = () => {},
}: ProductCategoryDropDownProps): React.JSX.Element {
  const [isDisabled] = React.useState(disabled);
  const context = useFormContext();
  if (!context) {
    throw new Error(
      'ProductCategoryDropDown must be used within a FormProvider',
    );
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && !required && (
        <Form.Label htmlFor="productCategory">{label}</Form.Label>
      )}
      {label && required && (
        <RequiredLabel htmlFor="productCategory">{label}</RequiredLabel>
      )}
      <Form.Select
        id="productCategory"
        size="lg"
        aria-label="Product Category Dropdown"
        {...register('productCategory')}
        disabled={isDisabled}
        required={required}
        isInvalid={!!errors.productCategory}
        onChange={onChange}
      >
        {Object.values(ProductCategory)
          .filter((productCategory) => typeof productCategory === 'string')
          .sort()
          .map((productCategory) => (
            <option key={productCategory} value={productCategory}>
              {getProductCategoryDisplayName(
                productCategory as ProductCategory,
              )}
            </option>
          ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.productCategory
          ? errors.productCategory.message?.toString()
          : null}
      </Form.Control.Feedback>
    </>
  );
}

export default ProductCategoryDropDown;
