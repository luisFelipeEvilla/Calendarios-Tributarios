import { Box } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Table from '../components/layouts/table'
import styles from '../styles/Home.module.css'

// import data
import data from '../data.json';

const Home: NextPage = () => {
  
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{width: 1000, height: 500}}> 
        <Table data={data} />
      </Box>
    </>
  )
}

export default Home
