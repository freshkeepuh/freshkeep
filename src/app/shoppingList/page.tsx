'use client';

import React, { useState, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import ShoppingListCard from '@/components/ShoppingListCard';
import ShoppingListModal from '@/components/ShoppingListModal';

const ShoppingListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState<{
    title: string;
    items: typeof samplegroceryItems;
  } | null>(null);

  const samplegroceryItems = useMemo(
    () => [
      {
        id: 'groceryItem-1',
        groceryItemImage: 'https://images.cdn.shop.foodland.com/detail/4011.jpg',
        groceryItemTitle: 'Bananas',
        store: 'Foodland',
        storageType: 'Counter',
        groceryItemType: 'Fruit',
        inList: true,
      },
      {
        id: 'groceryItem-2',
        groceryItemImage: 'https://bit.ly/464OM4c',
        groceryItemTitle: 'Greek Yogurt',
        store: 'Walmart',
        storageType: 'Refrigerator',
        groceryItemType: 'Dairy',
        inList: true,
      },
      {
        id: 'groceryItem-3',
        groceryItemImage:
          'https://target.scene7.com/is/image/Target/GUEST_ed5b1220-2654-467f-bb70-0a4ad8fe9c13?wid=750&qlt=80',
        groceryItemTitle: 'Whole Wheat Bread',
        store: 'Target',
        storageType: 'Pantry',
        groceryItemType: 'Bakery',
        inList: true,
      },
      {
        id: 'groceryItem-5',
        groceryItemImage: 'https://bit.ly/4npYvJI',
        groceryItemTitle: 'Garlic Powder',
        store: 'Walmart',
        storageType: 'Spice Rack',
        groceryItemType: 'Spices',
        inList: true,
      },
      {
        id: 'groceryItem-6',
        groceryItemImage:
          'https://target.scene7.com/is/image/Target/GUEST_ea9257fa-2303-4444-b10f-57e2937a1b4e?wid=750&qlt=80',
        groceryItemTitle: 'Chicken Breast',
        store: 'Foodland',
        storageType: 'Refrigerator',
        groceryItemType: 'Meat',
        inList: true,
      },
      {
        id: 'groceryItem-7',
        groceryItemImage:
          'https://target.scene7.com/is/image/Target/GUEST_5ae5aa78-6d3d-4691-add6-e74acd3c45d4?wid=750&qlt=80',
        groceryItemTitle: 'Pasta',
        store: 'Target',
        storageType: 'Pantry',
        groceryItemType: 'Grain',
        inList: true,
      },
      {
        id: 'groceryItem-8',
        groceryItemImage: 'https://target.scene7.com/is/image/Target/GUEST_8cc36efc-6e13-4cd6-aac4-dc0d79de2851',
        groceryItemTitle: 'Oreos',
        store: 'Walmart',
        storageType: 'Pantry',
        groceryItemType: 'Snacks',
        inList: true,
      },
    ],
    [],
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedStorageTypes, setSelectedStorageTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const uniqueStores = useMemo(() => [...new Set(samplegroceryItems.map((item) => item.store))], [samplegroceryItems]);
  const uniqueStorageTypes = useMemo(
    () => [...new Set(samplegroceryItems.map((item) => item.storageType))],
    [samplegroceryItems],
  );
  const uniqueTypes = useMemo(
    () => [...new Set(samplegroceryItems.map((item) => item.groceryItemType))],
    [samplegroceryItems],
  );

  const filteredItems = useMemo(
    () =>
      samplegroceryItems.filter((item) => {
        const matchesSearch = item.groceryItemTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStore = selectedStores.length === 0 || selectedStores.includes(item.store);
        const matchesStorage = selectedStorageTypes.length === 0 || selectedStorageTypes.includes(item.storageType);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.groceryItemType);
        return matchesSearch && matchesStore && matchesStorage && matchesType;
      }),
    [searchTerm, selectedStores, selectedStorageTypes, selectedTypes, samplegroceryItems],
  );

  const toggleFilter = (
    value: string,
    filterArray: string[],
    setFilterArray: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item) => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedStores([]);
    setSelectedStorageTypes([]);
    setSelectedTypes([]);
    setSearchTerm('');
  };

  const handleButtonClick = (itemTitle: string, inList: boolean) => {
    console.log(`${inList ? 'Removing' : 'Adding'} ${itemTitle} ${inList ? 'from' : 'to'} list`);
  };

  const activeFiltersCount = selectedStores.length + selectedStorageTypes.length + selectedTypes.length;

  // Test data for shopping list cards
  const shoppingLists = [
    {
      id: 1,
      title: 'Weekly Groceries',
      items: ['Bananas', 'Greek Yogurt', 'Whole Wheat Bread', 'Chicken Breasts', 'Olive Oil'],
      fullItems: samplegroceryItems.slice(0, 5),
    },
    {
      id: 2,
      title: 'Party Supplies',
      items: ['Chips', 'Soda', 'Paper Plates', 'Napkins', 'Ice Cream'],
      fullItems: samplegroceryItems.slice(0, 5),
    },
    {
      id: 3,
      title: 'Breakfast Essentials',
      items: ['Eggs', 'Bacon', 'Orange Juice', 'Cereal', 'Milk'],
      fullItems: samplegroceryItems.slice(0, 5),
    },
    {
      id: 4,
      title: 'Meal Prep',
      items: ['Rice', 'Beans', 'Ground Beef', 'Tomatoes', 'Onions', 'Bell Peppers'],
      fullItems: samplegroceryItems.slice(0, 6),
    },
  ];

  const handleEditList = (list: (typeof shoppingLists)[0]) => {
    setSelectedList({
      title: list.title,
      items: list.fullItems,
    });
    setShowModal(true);
  };

  return (
    <Container fluid className="p-5">
      <h1>Shopping List</h1>
      <div
        style={{
          width: '650px',
          height: '75px',
          margin: '0 auto',
        }}
        className="d-flex justify-content-center bg-success p-1 rounded mb-4"
      >
        <Row className="align-items-center justify-content-center py-3" style={{ height: '50px' }}>
          <Col xs="auto" className="px-1">
            <Form.Control
              type="search"
              placeholder="Search Grocery Item"
              style={{ width: '400px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs="auto" className="ps-1">
            <Button variant="light" onClick={() => setShowFilters(!showFilters)}>
              Filters
              {activeFiltersCount > 0 && <Badge bg="success">{activeFiltersCount}</Badge>}
            </Button>
          </Col>
          <Col xs="auto" className="ps-1">
            <Button variant="light" href="/catalog">
              Add To List
            </Button>
          </Col>
        </Row>
      </div>

      {showFilters && (
        <div
          className="border rounded shadow-sm p-4 mb-4"
          style={{
            maxWidth: '800px',
            margin: '0 auto 1rem auto',
            background: '#F4FAF4',
            borderColor: '#D8E8D8',
            borderRadius: '12px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Filters</h4>
            <Button
              variant="link"
              size="sm"
              className="p-0"
              style={{ color: '#3b633bff', textDecoration: 'underline' }}
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          </div>
          <Row className="g-4">
            <Col md={4} className="d-flex flex-column ps-3">
              <div className="mb-2" style={{ fontSize: '18px', fontWeight: '640', color: '#3B593B' }}>
                Store
              </div>
              {uniqueStores.map((store) => (
                <Form.Check
                  key={store}
                  type="checkbox"
                  id={`store-${store}`}
                  label={store}
                  checked={selectedStores.includes(store)}
                  onChange={() => toggleFilter(store, selectedStores, setSelectedStores)}
                  className="mb-1"
                  style={{ fontSize: '16px' }}
                />
              ))}
            </Col>

            <Col md={4}>
              <div className="mb-2" style={{ fontSize: '18px', fontWeight: '640', color: '#3B593B' }}>
                Storage Type
              </div>
              {uniqueStorageTypes.map((storage) => (
                <Form.Check
                  key={storage}
                  type="checkbox"
                  id={`storage-${storage}`}
                  label={storage}
                  checked={selectedStorageTypes.includes(storage)}
                  onChange={() => toggleFilter(storage, selectedStorageTypes, setSelectedStorageTypes)}
                  className="mb-1"
                  style={{ fontSize: '16px' }}
                />
              ))}
            </Col>

            <Col md={4}>
              <div className="mb-2" style={{ fontSize: '18px', fontWeight: '640', color: '#3B593B' }}>
                Type
              </div>
              {uniqueTypes.map((type) => (
                <Form.Check
                  key={type}
                  type="checkbox"
                  id={`type-${type}`}
                  label={type}
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                  className="mb-1"
                  style={{ fontSize: '16px' }}
                />
              ))}
            </Col>
          </Row>
        </div>
      )}

      <div className="mb-3 text-muted" style={{ fontSize: '14px' }}>
        Showing {filteredItems.length} of {samplegroceryItems.length} items
      </div>

      <div
        className="bg-success bg-opacity-10 border-bottom border-success border-2 py-3 px-4 mb-3"
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 140px 140px 140px 120px',
          gap: '20px',
          fontWeight: '600',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#198754',
        }}
      >
        <div>Image</div>
        <div>Item Name</div>
        <div>Type</div>
        <div>Storage</div>
        <div>Store</div>
        <div className="text-center">Actions</div>
      </div>

      <div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded mb-2 py-3 px-4"
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 140px 140px 140px 120px',
                gap: '20px',
                alignItems: 'center',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(25, 135, 84, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              <div>
                <Image
                  src={item.groceryItemImage}
                  alt={item.groceryItemTitle}
                  width={80}
                  height={80}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#212529' }}>{item.groceryItemTitle}</div>
              </div>

              <div>
                <Badge bg="success" className="px-3 py-2">
                  {item.groceryItemType}
                </Badge>
              </div>

              <div>
                <Badge bg="secondary" className="px-3 py-2">
                  {item.storageType}
                </Badge>
              </div>

              <div>
                <Badge bg="secondary" className="px-3 py-2">
                  {item.store}
                </Badge>
              </div>

              <div className="text-center">
                <Button
                  variant={item.inList ? 'outline-danger' : 'success'}
                  size="sm"
                  onClick={() => handleButtonClick(item.groceryItemTitle, item.inList)}
                  style={{ width: '100px' }}
                >
                  {item.inList ? 'Remove' : 'Add'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 text-muted">
            <h5>No items found</h5>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Shopping List Cards */}
      <h2 className="mb-4">My Shopping Lists</h2>
      <Row className="mb-5">
        {shoppingLists.map((list) => (
          <Col key={list.id} lg={3} md={6} sm={12} className="mb-4">
            <ShoppingListCard listTitle={list.title} items={list.items} onEdit={() => handleEditList(list)} />
          </Col>
        ))}
      </Row>

      {/* Shopping List Modal */}
      {selectedList && (
        <ShoppingListModal
          show={showModal}
          onHide={() => setShowModal(false)}
          listTitle={selectedList.title}
          items={selectedList.items}
        />
      )}
    </Container>
  );
};

export default ShoppingListPage;
