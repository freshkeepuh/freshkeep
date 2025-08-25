import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { stuffConditions, Stuffs } from './StuffCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { MATPCollections } from '../matp/MATPCollections';
import { testDefine, testDumpRestore, testUpdate } from '../utilities/test-helpers';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = Stuffs.getCollectionName();

if (Meteor.isServer) {
  describe(collectionName, function testSuite() {
    const collection = MATPCollections.getCollection(collectionName);

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 2 }),
          fc.integer({ min: 1, max: 10 }),
          fc.lorem({ maxCount: 1 }),
          fc.integer({ min: 0, max: stuffConditions.length - 1 }),
          (name, quantity, owner, choice) => {
            const condition = stuffConditions[choice];
            const definitionData = { name, quantity, owner, condition };
            testDefine(collection, definitionData);
          },
        ),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const name = faker.animal.dog();
      const quantity = faker.datatype.number({ min: 1, max: 5 });
      const owner = faker.internet.email();
      const condition = stuffConditions[Math.floor(Math.random() * stuffConditions.length)];
      const docID1 = collection.define({ name, quantity, condition, owner });
      const docID2 = collection.define({ name, quantity, condition, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const owner = faker.lorem.words();
      const condition = stuffConditions[faker.datatype.number({ min: 1, max: stuffConditions.length - 1 })];
      const docID = collection.define({
        name,
        quantity,
        owner,
        condition,
      });
      // console.log(collection.findDoc(docID));
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 2 }),
          fc.integer({ max: 10 }),
          fc.integer({ min: 0, max: stuffConditions.length - 1 }),
          (newName, newQuantity, index) => {
            // console.log('update', index, stuffConditions[index]);
            const updateData = { name: newName, quantity: newQuantity, condition: stuffConditions[index] };
            testUpdate(collection, docID, updateData);
          },
        ),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      testDumpRestore(collection);
    });
  });
}
