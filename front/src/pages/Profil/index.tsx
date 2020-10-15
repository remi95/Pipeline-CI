import React, { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Row, Col, FormGroup, Form, Label, Input, Button,
} from 'reactstrap';
import Layout from '../../components/Layout/Layout';
import './Profil.scss';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const Profil: React.FC = (props: any) => {
  const [date, setDate] = useState(null);
  const [form, setForm] = useState({});
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  const handleDateChange = (date: any): void => {
    setDate(date);
    setForm({
      ...form,
      date,
    });
  };

  const handleInputChange = (e: any): void => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const previewImage = (e: ChangeEvent): void => {
    const inputFile = e.target as HTMLInputElement;
    if ('files' in inputFile && inputFile.files) {
      if (inputFile.files.length > 0) {
        setPicturePreview(URL.createObjectURL(inputFile.files[0]));
      }
    }
  };

  const handleSubmit = (): void => {
    console.log(form);
  };

  return (
    <Layout>
      <div className="profil-page">
        <Breadcrumb items={[{ label: 'Profil' }]} />

        <Row className="profil-form row mt-3 mb-3 p-4 rounded">
          <Col md={8}>
            <h1 className="mb-5">Modifier mes informations</h1>
            <Form>
              <Row form className="mb-3">
                <Col md={5}>
                  <FormGroup>
                    <Label for="name">Nom</Label>
                    <Input type="text" name="name" id="name" placeholder="Saisissez votre nom" onChange={handleInputChange} />
                  </FormGroup>
                </Col>
                <Col md={5} className="offset-md-1">
                  <FormGroup>
                    <Label for="firstname">Prénom</Label>
                    <Input type="text" name="firstname" id="firstname" placeholder="Saisissez votre prénom" onChange={handleInputChange} />
                  </FormGroup>
                </Col>
              </Row>

              <Row form className="mb-3">
                <Col md={5}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="Saisissez votre email" onChange={handleInputChange} />
                  </FormGroup>
                </Col>
                <Col md={5} className="offset-md-1">
                  <Label for="date">Date de naissance</Label>
                  <DatePicker
                    className="form-control"
                    placeholderText="Saisissez votre date de naissance"
                    selected={date}
                    name="date"
                    onChange={handleDateChange}
                  />
                </Col>
              </Row>

              <Row form className="mb-3">
                <Col md={5}>
                  <FormGroup>
                    <Label for="phone">Téléphone</Label>
                    <Input type="tel" name="phone" id="phone" placeholder="Saisissez votre numéro de téléphone" onChange={handleInputChange} />
                  </FormGroup>
                </Col>
              </Row>

              <Row form className="mb-3">
                <Col md={5}>
                  <FormGroup>
                    <Label for="oldPassword">Ancien mot de passe</Label>
                    <Input type="text" name="oldPassword" id="oldPassword" placeholder="Saisissez votre ancien mot de passe" onChange={handleInputChange} />
                  </FormGroup>
                </Col>
                <Col md={5} className="offset-md-1">
                  <FormGroup>
                    <Label for="newPassword">Nouveau mot de passe</Label>
                    <Input type="text" name="newPassword" id="newPassword" placeholder="Saisissez votre nouveau mot de passe" onChange={handleInputChange} />
                  </FormGroup>
                </Col>
              </Row>

            </Form>
          </Col>
          <Col className="right-col">
            <Form>
              <FormGroup>
                <Label for="picture">Photo de profil</Label>
                <Input type="file" name="picture" id="picture" onChange={(e: ChangeEvent): void => previewImage(e)} />
              </FormGroup>
            </Form>

            {
              picturePreview
                ? <img src={picturePreview} alt="preview" className="img-preview" />
                : null
            }

            <Button type="submit" onClick={handleSubmit}>Modifier mes informations</Button>

          </Col>
        </Row>

      </div>
    </Layout>
  );
};

export default Profil;
