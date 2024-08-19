import React from "react";
import {
  Container,
  Box,
} from "@mui/material";
import { SignIn } from "@clerk/nextjs";
import ResponsiveAppBar from "@/components/navbar";

// UI for new users to authenticate
export default function SignInPage() {
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
          <SignIn 
            signUpUrl="/sign-up" // Add this line to set the sign-up URL
          />
        </Box>
      </Container>
    </Box>
  );
}
