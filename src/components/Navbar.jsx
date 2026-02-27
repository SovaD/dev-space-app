import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Layout, Search, Bookmark } from "lucide-react";
import { SourceContext } from "../context/SourceContext";

const Navbar = () => {
  const location = useLocation();
  const { source, setSource } = useContext(SourceContext);

  const handleSourceChange = (event, newSource) => {
    if (newSource !== null) setSource(newSource);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#161b22",
        borderBottom: "1px solid #30363d",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", px: "0 !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, color: "#ff8c00", letterSpacing: -1 }}
            >
              DEV<span style={{ color: "#fff" }}>SPACE</span>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ToggleButtonGroup
              value={source}
              exclusive
              onChange={handleSourceChange}
              size="small"
              sx={{ bgcolor: "#0b0e14", border: "1px solid #30363d", mr: 2 }}
            >
              <ToggleButton
                value="habr"
                sx={{
                  color: "#8b949e",
                  "&.Mui-selected": { color: "#ff8c00", bgcolor: "#1f242c" },
                }}
              >
                HABR
              </ToggleButton>
              <ToggleButton
                value="devto"
                sx={{
                  color: "#8b949e",
                  "&.Mui-selected": { color: "#ff8c00", bgcolor: "#1f242c" },
                }}
              >
                DEV.TO
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              component={Link}
              to="/feed"
              sx={{ color: location.pathname === "/feed" ? "#ff8c00" : "#fff" }}
              startIcon={<Layout size={18} />}
            >
              Лента
            </Button>
            <Button
              component={Link}
              to="/explore"
              sx={{
                color: location.pathname === "/explore" ? "#ff8c00" : "#fff",
              }}
              startIcon={<Search size={18} />}
            >
              Поиск
            </Button>
            <Button
              component={Link}
              to="/bookmarks"
              sx={{
                color: location.pathname === "/bookmarks" ? "#ff8c00" : "#fff",
              }}
              startIcon={<Bookmark size={18} />}
            >
              Закладки
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
