import React from 'react';
import { Form } from 'react-bootstrap';
import { Product } from '@prisma/client';
import { useFormContext } from 'react-hook-form';

interface ProductFilterProps {
  label?: string;
  disabled?: boolean;
  products?: Product[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const ProductFilter: React.FC<ProductFilterProps> = (
  {
    label = 'Product',
    disabled = false,
    products = [],
    onChange = () => { /* no-op */ },
  },
) => {
  const context = useFormContext();
  if (!context) {
    throw new Error('ProductFilter must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && <Form.Label htmlFor="productFilter">{label}</Form.Label>}
      <Form.Select
        id="productFilter"
        size="lg"
        as="select"
        aria-label="Product Filter"
        {...register('product')}
        disabled={disabled}
        isInvalid={!!errors.product}
        onChange={onChange}
      >
        <option key="all" value="">All</option>
        {
          products.sort((a, b) => a.name.localeCompare(b.name))
            .map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))
        }
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.product ? errors.product.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
};

export default ProductFilter;
