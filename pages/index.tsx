import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Table from '../components/layouts/table';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '../styles/Home.module.css'

// import data
import data from '../data.json';

const Home: NextPage = () => {
  const accordionSummaryStyle = {
    backgroundColor: 'gray',
  }

  const tableStyles = {
    width: 1000,
    height: 500,
  }
  
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{width: '100%'}}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={accordionSummaryStyle}
          >
            <Typography>Impuestos Nacionales</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={tableStyles}>
              <Table data={data} />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={accordionSummaryStyle}
          >
            <Typography>Impuestos Departamentales</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={tableStyles}>
              <Table data={data} />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={accordionSummaryStyle}
          >
            <Typography>Impuestos Municipales</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={tableStyles}>
              <Table data={data} />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  )
}

export default Home
