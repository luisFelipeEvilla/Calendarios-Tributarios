"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Client {
  id: number;
  nit: string;
  nombre_empresa: string;
  pagina_web: string;
  emails: string;
  nombre_representante_legal: string;
}

export default function Clientes() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const sortByName = (clientsList: Client[]) => {
    return [...clientsList].sort((a, b) =>
      a.nombre_empresa.localeCompare(b.nombre_empresa, "es", {
        sensitivity: "base",
      })
    );
  };

  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await axios.get("/api/client");
        const sortedClients = sortByName(response.data);
        setClients(sortedClients);
        setFilteredClients(sortedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    getClients();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);

    const filtered = clients.filter((client) => {
      const sanitizedNombreEmpresa = client.nombre_empresa
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const sanitizedNit = client.nit || "";
      return (
        sanitizedNombreEmpresa.toLowerCase().includes(search.toLowerCase()) ||
        sanitizedNit.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredClients(sortByName(filtered));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "#1976d2",
      "#388e3c",
      "#d32f2f",
      "#7b1fa2",
      "#f57c00",
      "#0288d1",
      "#689f38",
      "#512da8",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: 4,
        px: 3,
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        overflow: "auto",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
          borderRadius: 3,
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <BusinessIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Gestión de Clientes
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              Administra y visualiza la información de todos tus clientes
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Buscar por nombre de empresa o NIT..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            mt: 3,
            backgroundColor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { border: "none" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
          <Chip
            label={`${clients.length} clientes totales`}
            sx={{
              backgroundColor: alpha("#fff", 0.2),
              color: "white",
              fontWeight: 500,
            }}
          />
          {searchTerm && (
            <Chip
              label={`${filteredClients.length} resultados`}
              sx={{
                backgroundColor: alpha("#fff", 0.2),
                color: "white",
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Cards Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Card sx={{ borderRadius: 3, p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Skeleton variant="circular" width={56} height={56} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Box>
                </Box>
                <Skeleton
                  variant="rectangular"
                  height={80}
                  sx={{ borderRadius: 2 }}
                />
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    width="50%"
                    height={36}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="50%"
                    height={36}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredClients.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "white",
          }}
        >
          <BusinessIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta con otro término de búsqueda
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredClients.map((client) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={client.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: getAvatarColor(client.nombre_empresa),
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(client.nombre_empresa)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Tooltip title={client.nombre_empresa} arrow placement="top">
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: "default",
                          }}
                        >
                          {client.nombre_empresa}
                        </Typography>
                      </Tooltip>
                      <Chip
                        size="small"
                        icon={<BadgeIcon sx={{ fontSize: 14 }} />}
                        label={client.nit}
                        sx={{
                          mt: 0.5,
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Info */}
                  <Box
                    sx={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: 2,
                      p: 2,
                      mb: 2.5,
                    }}
                  >
                    <InfoRow
                      icon={<PersonIcon sx={{ fontSize: 18 }} />}
                      label="Representante"
                      value={client.nombre_representante_legal}
                    />
                    <InfoRow
                      icon={<EmailIcon sx={{ fontSize: 18 }} />}
                      label="Email"
                      value={client.emails?.split(",")[0] || "N/A"}
                    />
                    <InfoRow
                      icon={<LanguageIcon sx={{ fontSize: 18 }} />}
                      label="Web"
                      value={client.pagina_web || "N/A"}
                      isLast
                    />
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Button
                      component={Link}
                      href={`/cliente/${client.id}/gestionTributaria`}
                      variant="contained"
                      fullWidth
                      startIcon={<AccountBalanceIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1,
                        background:
                          "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #1565c0 0%, #0a3d91 100%)",
                        },
                      }}
                    >
                      Gestionar
                    </Button>
                    <Button
                      component={Link}
                      href={`/cliente/${client.id}`}
                      variant="outlined"
                      fullWidth
                      startIcon={<VisibilityIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1,
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        "&:hover": {
                          borderColor: "#1565c0",
                          backgroundColor: alpha("#1976d2", 0.05),
                        },
                      }}
                    >
                      Detalles
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function InfoRow({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 0.75,
        borderBottom: isLast ? "none" : "1px solid #e9ecef",
      }}
    >
      <Box sx={{ color: "#1976d2" }}>{icon}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", lineHeight: 1.2 }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
