import { Box } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

// import data
import data from '../../data.json';

// components
import Layout from '../../components/layout';
import Accordeon from '../../components/layouts/accordion';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ width: '100%' }}>
        <Accordeon title="Impuestos Nacionales" data={data} />
      </Box>
    </Layout>
  )
}

export default Home
