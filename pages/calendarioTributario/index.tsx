import { Box } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

// import data
import data from '../../data.json';

// components
import Layout from '../../components/layout';
import Accordeon from '../../components/layouts/accordion';
import PrivateRoute from '../../components/protectedRoute';
import axios from 'axios';


const Home: NextPage = ({...props}: any) => {
  console.log(props.taxes)
  return (
      <Layout>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box sx={{ width: '100%' }}>
          <Accordeon title="Impuestos Nacionales" data={props.taxes} />
        </Box>
      </Layout>
  )
}

export async function getServerSideProps(ctx: any) {
  const url = 'http://localhost:8000/api/impuesto';

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
