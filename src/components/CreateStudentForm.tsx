'use client';

import { useState } from 'react';
import { Form, Alert, Button, Col, Container, Card, ButtonGroup, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Multiselect from 'multiselect-react-dropdown';
import { upsertStudent } from '@/lib/dbActions';
import swal from 'sweetalert';
import {
  CreateStudentSchema,
  hobbyKeys,
  levelKeys,
  majorKeys,
  gpaValues,
  ICreateStudentForm,
} from '@/lib/validationSchemas';

const CreateStudentForm = () => {
  const formPadding = 'py-1';
  const [emailState, setEmailState] = useState<string>('');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateStudentSchema),
  });

  const onSubmit = async (data: {
    email: string;
    bio?: string | undefined;
    level: string;
    gpa: number;
    major?: string | undefined;
    name: string;
    hobbies?: (string | undefined)[] | undefined;
    enrolled?: Date | undefined;
  }) => {
    const result = await upsertStudent(data as ICreateStudentForm);
    if (result) {
      swal('Success!', 'Student data saved successfully!', 'success');
      reset();
      setEmailState(data.email);
    } else {
      swal('Error!', 'Failed to save student data!', 'error');
    }
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="formName">
                  <Form.Label>
                    Name
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Your name"
                    {...register('name')}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formEmail">
                  <Form.Label>
                    Email
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Your email"
                    {...register('email')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Form.Group controlId="formBio">
                <Form.Label>Biographical Statement</Form.Label>
                <Form.Control as="textarea" placeholder="A bit about you" {...register('bio')} />
                <Form.Text muted>(optional)</Form.Text>
              </Form.Group>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="formLevel">
                  <Form.Label>
                    Level
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Select {...register('level')} className={`form-control ${errors.level ? 'is-invalid' : ''}`}>
                    {levelKeys.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="invalid-feedback">{errors.level?.message}</div>
                  <Form.Text muted>What is your level?</Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formGPA">
                  <Form.Label>
                    GPA
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Select {...register('gpa')}>
                    {gpaValues.map((gpa, index) => (
                      <option key={gpa} value={index}>
                        {gpa}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="invalid-feedback">{errors.gpa?.message}</div>
                  <Form.Text>Select one</Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formEnrolled">
                  <Form.Label>
                    Date Enrolled
                    <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    {...register('enrolled')}
                    className={`form-control ${errors.enrolled ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.enrolled?.message}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Form.Group controlId="formHobbies">
                <Form.Label>Hobbies&nbsp;&nbsp;</Form.Label>
                <Controller
                  control={control}
                  name="hobbies"
                  render={({ field: { value, onChange } }) => (
                    <Multiselect
                      options={hobbyKeys}
                      isObject={false}
                      showCheckbox
                      hidePlaceholder
                      closeOnSelect={false}
                      onSelect={onChange}
                      onRemove={onChange}
                      selectedValues={value}
                    />
                  )}
                />
                <Form.Text className="text-muted"> Select hobbies</Form.Text>
              </Form.Group>
            </Row>
            <Row className={formPadding}>
              <Form.Group controlId="formMajor">
                <Form.Label>
                  Major
                  <Form.Text style={{ color: 'red' }}>*</Form.Text>
                  &nbsp;
                </Form.Label>
                <ButtonGroup className={`form-control ${errors.major ? 'is-invalid' : ''}`}>
                  {majorKeys.map((major) => (
                    <Form.Check
                      key={major}
                      inline
                      type="radio"
                      label={major}
                      id={major}
                      value={major}
                      {...register('major')}
                    />
                  ))}
                </ButtonGroup>
                <div className="invalid-feedback">{errors.major?.message}</div>
                <Form.Text>What is your major?</Form.Text>
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
        {emailState ? (
          <Alert variant="success">
            <a href={`/student/${emailState}`}>Edit this data.</a>
          </Alert>
        ) : (
          ''
        )}
      </Card>
    </Container>
  );
};

export default CreateStudentForm;
