import React from "react";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

// UI for existing users to authenticate
export default function SignUpPage() {
  return (
    <Container maxWidth="lg">
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>

          <Button color="inherit">
            {/* Link for server-side */}
            <Link href="/sign-in" passHref style={{ color: "white" }}>
              Login
            </Link>
          </Button>

          <Button color="inherit">
            <Link href="/sign-up" passHref style={{ color: "white" }}>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Container>
  );
}
