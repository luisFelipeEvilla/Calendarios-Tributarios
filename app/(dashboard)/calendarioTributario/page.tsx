'use client'
import { Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

// components
import Layout from '../../../components/layout';
import Accordeon from '../../../components/layouts/accordion';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Spinner from '../../../components/layouts/spinner';
import { Departamento, Municipio } from '../../../types';
import { FiltersContext } from '../../../contexts/FiltersContext';


const Home: NextPage = ({ ...props }: any) => {
  const [nacionales, setNacionales] = useState([]);
  const [departamentales, setDepartamentales] = useState([]);
  const [municipales, setMunicipales] = useState([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMuicipios] = useState<Municipio[]>([]);

  const [loading, setLoading] = useState(true);

  const { year, setYear } = useContext(FiltersContext);

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    const url = `api/tax?vigencia=${year}`;

    let taxes = [];
    try {
      setLoading(true);
      const request = await axios.get(url);
      const taxes = request.data;
      // @ts-ignore
      setNacionales(taxes.filter((tax) => tax.tipo == 1));
      // @ts-ignore
      setDepartamentales(taxes.filter((tax) => tax.tipo == 2));
      // @ts-ignore
      setMunicipales(taxes.filter((tax) => tax.tipo == 3));

      const departamentosUrl = `api/departamento`;
      const departamentosRequest = await axios.get(departamentosUrl);

      setDepartamentos(departamentosRequest.data);

      const municipiosUrl = `api/municipio`;
      const municipiosRequest = await axios.get(municipiosUrl);

      setMuicipios(municipiosRequest.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Calendario Tributario</title>
      </Head>
      <Box sx={{ width: '100%', textAlign: 'center', marginTop: 6 }}>
        <Box marginBottom={8}>
          <Typography variant="h2" component="h1" gutterBottom> Calendario Tributario </Typography>
          <Typography variant='body1'>Aqui podras Encontrar todar la información relacionada a los calendarios tributarios</Typography>
        </Box>
        {
          loading ? <Spinner /> :
            <div>
              <Box sx={{ width: '100%' }}>
                <Accordeon title="Impuestos Nacionales" data={nacionales} />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Accordeon title="Impuestos Departamentales" data={departamentales} isDepartamental={true} departamentos={departamentos} />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Accordeon title="Impuestos Municipales" data={municipales} isMunicipal={true} departamentos={departamentos} municipios={municipios} />
              </Box>
            </div>
        }

      </Box>
    </Layout>
  )
}

export default Home
