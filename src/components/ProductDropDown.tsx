import React from 'react';
import { Form } from 'react-bootstrap';
import { Product } from '@prisma/client';
import { useFormContext } from 'react-hook-form';
import RequiredLabel from '@/components/RequiredLabel';

interface ProductDropDownProps {
  label: string;
  disabled: boolean;
  required: boolean;
  products: Product[];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

function ProductDropDown({
  label = 'Product',
  disabled = false,
  required = false,
  products = [],
  onChange = () => {
    /* no-op */
  },
}: ProductDropDownProps) {
  const context = useFormContext();
  if (!context) {
    throw new Error('ProductDropDown must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && !required && <Form.Label htmlFor="product">{label}</Form.Label>}
      {label && required && (
        <RequiredLabel htmlFor="product">{label}</RequiredLabel>
      )}
      <Form.Select
        id="product"
        size="lg"
        as="select"
        aria-label="Product Dropdown"
        {...register('product')}
        disabled={disabled}
        isInvalid={!!errors.product}
        onChange={onChange}
      >
        {products
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.product ? errors.product.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
}

export default ProductDropDown;
