import React from "react";
import {
  Container,
  Box,
} from "@mui/material";
import { SignUp } from "@clerk/nextjs";
import ResponsiveAppBar from "@/components/navbar";

// UI for existing users to authenticate
export default function SignUpPage() {
  return (
    <Box>
    <ResponsiveAppBar userPresent={false}/>
    <Container maxWidth="lg">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingTop="100px"
      >
        <SignUp signInUrl="/sign-in"/>
      </Box>
    </Container>
    </Box>
  );
}
