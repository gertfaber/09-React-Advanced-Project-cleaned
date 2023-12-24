import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box, Center } from "@chakra-ui/react";

export const Root = () => {
  return (
    // <div>
    <Box backgroundColor="blue.0">
      <Box
        maxW="1500px"
        minHeight="100vh"
        padding="4"
        minW={375}
        border="1px solid #000"
        mx="auto"
      >
        <Center flexDir="column">
          <Navigation />
          <Outlet />
        </Center>
      </Box>
    </Box>
  );
};
