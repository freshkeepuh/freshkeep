import { ShoppingList } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

type StoreShoppingListsProps = {
  shoppingLists: ShoppingList[] | undefined;
};

export default function StoreShoppingLists({ shoppingLists }: StoreShoppingListsProps) {
  if (!shoppingLists) {
    return <div>Please provide Shopping Lists.</div>;
  }

  if (!shoppingLists || shoppingLists.length === 0) {
    return <div>No Shopping Lists found for this Store.</div>;
  }

  return (
    <div>
      <h3>Shopping Lists</h3>
      <ul>
        {shoppingLists.map(list => (
          <li key={list.id}>
            <div style={{ fontWeight: 600 }}><Link href={`/shoppingList/${list.id}`}>{list.name}</Link></div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {list.updatedAt ? ` • updated ${new Date(list.updatedAt).toLocaleString()}` : ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
