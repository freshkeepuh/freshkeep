import { Meteor } from 'meteor/meteor';
import { MATPCollections } from '../matp/MATPCollections';

export const removeAllEntities = () => {
  if (Meteor.isTest || Meteor.isAppTest) {
    MATPCollections.collections.forEach(collection => {
      collection._collection.remove({});
    });
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
  return true;
};
