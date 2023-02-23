import { Box } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

// import data
import data from '../../data.json';

// components
import Layout from '../../components/layout';
import Accordeon from '../../components/layouts/accordion';
import PrivateRoute from '../../components/protectedRoute';

const Home: NextPage = () => {
  return (
      <Layout>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box sx={{ width: '100%' }}>
          <Accordeon title="Impuestos Nacionales" data={data.nacionales} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Accordeon title="Impuestos Departamentales" data={data.departamentales} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Accordeon title="Impuestos Municipales" data={data.municipales} />
        </Box>
      </Layout>
  )
}

export default Home
