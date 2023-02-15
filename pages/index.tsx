import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Table from '../components/layouts/table';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// import data
import data from '../data.json';
import Layout from '../components/layout';

const Home: NextPage = () => {
  const accordionSummaryStyle = {
    backgroundColor: "primary.main",
    color: 'white',
  }

  const accordionStyle = {
    marginTop: 0.2
  }

  const tableStyles = {
    width: 1000,
    height: 500,
  }

  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ width: '100%'}}>
        <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
          <FormControl sx={{width: 100}}>
            <InputLabel>Año</InputLabel>
            <Select>
              <MenuItem>2023</MenuItem>
              <MenuItem>2024</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Accordion sx={accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={accordionSummaryStyle}
          >
            <Typography>Impuestos Nacionales</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={tableStyles}>
              <Table data={data} />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={accordionSummaryStyle}
          >
            <Typography>Impuestos Departamentales</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={tableStyles}>
              <Table data={data} />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{color: 'white'}} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={accordionSummaryStyle}
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
    </Layout>
  )
}

export default Home
