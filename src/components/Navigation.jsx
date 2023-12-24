import React from "react";
import { Link } from "react-router-dom";
import { UnorderedList, ListItem } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <nav>
      <UnorderedList
        display="flex"
        flexDirection="row"
        color="blue"
        listStyleType="none"
      >
        <ListItem marginRight="8">
          <Link to="/">Events</Link>
        </ListItem>
        <ListItem marginRight="8">
          <Link to="/categoties/">Categoties</Link>
        </ListItem>
        <ListItem marginRight="8">
          <Link to="/users/">Users</Link>
        </ListItem>
      </UnorderedList>
    </nav>
  );
};
