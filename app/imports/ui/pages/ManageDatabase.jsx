import React from 'react';
import { Button, Container } from 'react-bootstrap';
import swal from 'sweetalert';
import moment from 'moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { dumpDatabaseMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const ManageDatabase = () => {
  const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

  const submit = () => {
    dumpDatabaseMethod.callPromise()
      .catch(error => swal('Error', error.message, 'error'))
      .then(result => {
        const zip = new ZipZap();
        const dir = 'matp-db';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      });
  };
  return (
    <Container id={PAGE_IDS.MANAGE_DATABASE}>
      <Button id={COMPONENT_IDS.MANGAGE_DATABASE_DUMP} onClick={() => submit()}>Dump Database</Button>
    </Container>
  );
};

export default ManageDatabase;
