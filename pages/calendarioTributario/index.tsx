import { Box } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

// components
import Layout from '../../components/layout';
import Accordeon from '../../components/layouts/accordion';
import axios from 'axios';


const Home: NextPage = ({...props}: any) => {
  // @ts-ignore
  const nacionales = props.taxes.filter((tax) => tax.tipo == 1);
  // @ts-ignore
  const departamentales = props.taxes.filter((tax) => tax.tipo == 2);
  // @ts-ignore
  const municipales = props.taxes.filter((tax) => tax.tipo == 3);

  return (
      <Layout>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box sx={{ width: '100%' }}>
          <Accordeon title="Impuestos Nacionales" data={nacionales} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Accordeon title="Impuestos Departamentales" data={departamentales} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Accordeon title="Impuestos Municipales" data={municipales} />
        </Box>
      </Layout>
  )
}

export async function getServerSideProps(ctx: any) {
  const url = `${process.env.API_URL}/impuesto`;

  let taxes = [];
  try {
    const request = await axios.get(url);

    taxes = request.data.data;
  } catch (error) {
    console.error(error);
  }

  return {
      props: {
          taxes
      }
  }
}

export default Home
