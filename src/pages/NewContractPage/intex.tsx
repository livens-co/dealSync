import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Contract } from '../../types';
import { addContract } from '../../store/contractsSlice';
import './style.scss'


const NewContractPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues: Partial<Contract> = {
    kupac: '',
    broj_ugovora: '',
    datum_akontacije: '',
    rok_isporuke: '',
    status: 'KREIRANO',
  };

  const validationSchema = Yup.object({
    kupac: Yup.string().required('Obavezno polje'),
    broj_ugovora: Yup.string().required('Obavezno polje'),
    datum_akontacije: Yup.date().required('Obavezno polje'),
    rok_isporuke: Yup.date().required('Obavezno polje'),
  });

  const handleSubmit = (values: Partial<Contract>) => {
    dispatch(addContract(values));
    navigate('/');
  };

  return (
    <div className='newContractPage'>
      <h2>Novi ugovor</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className='inputField'>
              <label htmlFor="kupac">Kupac:</label>
              <Field type="text" name="kupac" />
              <ErrorMessage name="kupac" component="div" className='errorMessage'/>
            </div>
            <div className='inputField'>
              <label htmlFor="broj_ugovora">Broj ugovora:</label>
              <Field type="text" name="broj_ugovora" />
              <ErrorMessage name="broj_ugovora" component="div" className='errorMessage'/>
            </div>
            <div className='inputField'>
              <label htmlFor="datum_akontacije">Datum akontacije:</label>
              <Field type="date" name="datum_akontacije" />
              <ErrorMessage name="datum_akontacije" component="div" className='errorMessage'/>
            </div>
            <div className='inputField'>
              <label htmlFor="rok_isporuke">Rok dostave:</label>
              <Field type="date" name="rok_isporuke" />
              <ErrorMessage name="rok_isporuke" component="div" className='errorMessage'/>
            </div>
            <button type="submit" disabled={isSubmitting}>
              Napravi ugovor
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewContractPage;
