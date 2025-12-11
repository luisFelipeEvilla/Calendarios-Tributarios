'use client'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import PeopleIcon from "@mui/icons-material/People";
import SearchBar from "../../components/layouts/searchbar";
import Link from "next/link";
import Spinner from "../../components/layouts/spinner";
import Head from "next/head";
type Client = {
  id: number;
  nit: string;
  nombre_empresa: string;
  pagina_web: string;
  emails: string;
  nombre_representante_legal: string;
};

export default function Clientes() {
  const [loading, setLoading] = useState<boolean>(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    const getClients = async () => {
      const response = await axios.get("api/client");
      setClients(response.data);
      setFilteredClients(response.data);
      setLoading(false);
    };
    getClients();
  }, []);

  const handleSearch = (e: any) => {
    const search = e.target.value;
    const filtered = clients.filter((client) => {
      const sanitizedNombreEmpresa = client.nombre_empresa
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // elimina las tildes y acentos
      return sanitizedNombreEmpresa
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    setFilteredClients(filtered);
  };

  const getClientsCards = () => {
    return (
      <Box
        className="container"
        flexWrap={"wrap"}
        justifyContent={"center"}
        alignItems="center"
      >
        {filteredClients.map((client, index) => (
          <Card
            key={index}
            sx={{
              width: 400,
              margin: 5,
              height: 230,
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            {/* <CardMedia>
                                <Box sx={{ width: '100%', height: 180, backgroundColor: 'grey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Avatar sx={{ height: 120, width: 120 }} >
                                        {<PeopleIcon sx={{ height: 80, width: 80 }}></PeopleIcon>}
                                    </Avatar>
                                </Box>
                            </CardMedia> */}
            <CardContent sx={{ height: 170 }}>
              <Typography
                sx={{
                  display: "-webkit-box",
                  overflow: "clip",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
                color="Highlight"
                variant="h5"
              >
                {client.nombre_empresa}
              </Typography>
              <Typography variant="body2">
                <b>NIT: </b>
                {client.nit}
              </Typography>
              <Typography variant="body2">
                <b>Página web: </b>
                {client.pagina_web}
              </Typography>
              <Typography variant="body2">
                <b>Representante Legal: </b>
                {client.nombre_representante_legal}
              </Typography>
              <Typography variant="body2" sx={{ marginBotton: 0 }}>
                <b>Email: </b> {client.emails.split(",")[0]}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" size="medium" color="success">
                <Link
                  href={`/cliente/${client.id}/gestionTributaria`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {" "}
                  Gestion Tributaria{" "}
                </Link>
              </Button>
              <Button variant="contained" size="medium" color="info">
                <Link
                  href={`/cliente/${client.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {" "}
                  Detalles{" "}
                </Link>
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Clientes</title>
      </Head>
      <Box
        className="container"
        flexDirection={"column"}
        justifyContent={"center"}
        textAlign={"center"}
      >
        <Typography variant="h2">Clientes</Typography>
        <Typography variant="h6">Bienvenido al modulo de clientes</Typography>
        <Typography variant="body1">
          Aqui podras realizar todas las gestiones relacionadas con los clientes{" "}
        </Typography>
      </Box>

      {loading ? (
        <Spinner />
      ) : (
        <Box
          className="container"
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems="center"
          flexDirection={"column"}
        >
          <SearchBar handleSearch={handleSearch} />
          {getClientsCards()}
        </Box>
      )}
    </Layout>
  );
}
