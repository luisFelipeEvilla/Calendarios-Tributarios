"use client";
import { Box, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";

// import data

// components Home

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h2">Bienvenido a SGC</Typography>
      </Box>
    </div>
  );
};

export default Home;
