import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { Location, Product, ProductCategory, StorageArea, StorageType } from '@prisma/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import LocationFilter from '@/components/LocationFilter';
import StorageTypeFilter from '@/components/StorageTypeFilter';
import StorageAreaFilter from './StorageAreaFilter';
import ProductFilter from './ProductFilter';
import ProductCategoryFilter from './ProductCategoryFilter';
import { FormProvider, useForm } from 'react-hook-form';

interface ReportFilterProps {
  title: string;
  onFilterChange?: (
    location: string | null,
    storageType: string | null,
    storageArea: string | null,
    productCategory: string | null,
    product: string | null,
  ) => void;
}

const ReportFilter: React.FC<ReportFilterProps> = ({ title, onFilterChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [currLocations, setCurrentLocations] = useState<Location[] | undefined>(undefined);
  const [origLocations, setOriginalLocations] = useState<Location[] | undefined>(undefined);
  const [storageType, setStorageType] = useState<string | null>(null);
  const [storageArea, setStorageArea] = useState<string | null>(null);
  const [currStorageAreas, setCurrentStorageAreas] = useState<StorageArea[] | undefined>(undefined);
  const [origStorageAreas, setOriginalStorageAreas] = useState<StorageArea[] | undefined>(undefined);
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [currProducts, setCurrentProducts] = useState<Product[] | undefined>(undefined);
  const [origProducts, setOriginalProducts] = useState<Product[] | undefined>(undefined);
  const [isDisabled, setIsDisabled] = useState(false);
  const methods = useForm({
    defaultValues: {
      location: '',
      storageType: '',
      storageArea: '',
      productCategory: '',
      product: '',
    },
    mode: "all",
  });

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setIsDisabled(true);
      const { name, value } = event.target;
      switch (name) {
        case 'location':
          setLocation(value);
          if (origStorageAreas) {
            setCurrentStorageAreas(origStorageAreas.filter((area) => (area.locId === value || value === '') && (area.type === (storageType as StorageType) || !storageType)));
          }
          break;
        case 'storageType':
          setStorageType(value);
          if (origStorageAreas) {
            setCurrentStorageAreas(origStorageAreas.filter((area) => (area.locId === location || location === '') && (area.type === (value as StorageType) || !value)));
          }
          break;
        case 'storageArea':
          setStorageArea(value);
          break;
        case 'productCategory':
          setProductCategory(value);
          if (origProducts) {
            setCurrentProducts(origProducts.filter((prod) => prod.category === value || value === ''));
          }
          break;
        case 'product':
          setProduct(value);
          break;
        default:
          break;
      }
      if (onFilterChange) {
        onFilterChange(
          location,
          storageType,
          storageArea,
          productCategory,
          product,
        );
      }
    } finally {
      setIsDisabled(false);
    }
  };

  const onFormSubmit = () => {
    try {
      setIsDisabled(true);
      if (onFilterChange) {
        onFilterChange(
          location,
          storageType,
          storageArea,
          productCategory,
          product,
        );
      }
    } finally {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    const addError = (message: string) => {
      if (error) {
        setError(`${error}<br />${message}`);
        return;
      }
      setError(message);
    };

    const resetError = () => {
      setError(null);
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        resetError();
        try {
          const locationsRes = await fetch('/api/location', { cache: 'no-store' });
          if (!locationsRes.ok) {
            throw new Error(locationsRes.status.toString());
          }
          const locData = await locationsRes.json();
          setOriginalLocations(locData);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            addError(`Failed to load locations: ${errorMessage}`);
          }
          setOriginalLocations(undefined);
        }
        try {
          const storagesRes = await fetch('/api/storage', { cache: 'no-store' });
          if (!storagesRes.ok) {
            throw new Error(storagesRes.status.toString());
          }
          const storData = await storagesRes.json();
          setOriginalStorageAreas(storData);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            addError(`Failed to load storage areas: ${errorMessage}`);
          }
          setOriginalStorageAreas(undefined);
        }
        try {
          const productRes = await fetch('/api/product', { cache: 'no-store' });
          if (!productRes.ok) {
            throw new Error(productRes.status.toString());
          }
          const prodData = await productRes.json();
          setOriginalProducts(prodData);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            addError(`Failed to load products: ${errorMessage}`);
          }
          setOriginalProducts(undefined);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    setLocation('');
    setCurrentLocations(origLocations);
    setStorageType('');
    setStorageArea('');
    setCurrentStorageAreas(origStorageAreas);
    setProductCategory('');
    setProduct('');
    setCurrentProducts(origProducts);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h1 className='report-filter-title'>{title}</h1>
      {error && <p className="text-danger report-filter-error">{error}</p>}
      <FormProvider {...methods}>
        <Container className="report-filter-container">
          <Row className="report-filter-location-row">
            <Col className="report-filter-location-col">
              <LocationFilter
                label="Location"
                disabled={isDisabled}
                locations={currLocations}
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row className="report-filter-storage-row">
            <Col className="report-filter-storage-type-col">
              <StorageTypeFilter
                label="Storage Type"
                disabled={isDisabled}
                onChange={onChange}
              />
            </Col>
            <Col className="report-filter-storage-area-col">
              <StorageAreaFilter
                label="Storage Area"
                disabled={isDisabled}
                storageAreas={currStorageAreas}
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row className='report-filter-product-row'>
            <Col className='report-filter-product-category-col'>
              <ProductCategoryFilter
                label="Category"
                disabled={isDisabled}
                onChange={onChange}
              />
            </Col>
            <Col className='report-filter-product-col'>
              <ProductFilter
                label="Product"
                disabled={isDisabled}
                products={currProducts}
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row className="report-filter-buttons-row">
            <Col className="report-filter-search-button-col">
              <Button type="submit" onClick={methods.handleSubmit(onFormSubmit)} disabled={isDisabled}>Search</Button>
            </Col>
          </Row>
        </Container>
      </FormProvider>
    </>
  );
};

export default ReportFilter;
