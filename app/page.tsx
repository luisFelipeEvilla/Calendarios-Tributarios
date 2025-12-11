'use client'
import { Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

// import data

// components
import Layout from '../components/layout';
import Accordeon from '../components/layouts/accordion';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>
      <Box sx={{ width: '100%' }}>
        <Typography variant='h2'>Bienvenido a SGC</Typography>
      </Box>
    </Layout>
  )
}

export default Home
