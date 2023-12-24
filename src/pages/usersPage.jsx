import React, { useState, useEffect } from "react";
import {
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export const usersListLoader = async () => {
  const users = await fetch("http://localhost:3000/users");

  return { users: await users.json() };
};

export const UsersPage = () => {
  const { users } = useLoaderData();

  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isNewUserSuccessModalOpen, setNewUserSuccessModalOpen] =
    useState(false);
  const [newUser, setNewUser] = useState({
    name: "Gert Faber",
    image:
      "https://i1.rgstatic.net/ii/profile.image/277068190371842-1443069612774_Q128/Gert-Faber.jpg",
  });

  const [userList, setUserList] = useState(users);

  useEffect(() => {
    const fetchData = async () => {
      const updatedUsersResponse = await fetch("http://localhost:3000/users");
      const updatedUserList = await updatedUsersResponse.json();
      setUserList(updatedUserList);
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs only once on component mount

  const handleAddUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log("User added successfully!");

        // Fetch the updated user list
        const updatedUsersResponse = await fetch("http://localhost:3000/users");
        const updatedUserList = await updatedUsersResponse.json();

        // Update the user list in the state
        setUserList(updatedUserList);

        // Clear the input fields
        setNewUser({
          name: "Gert Faber",
          image:
            "https://i1.rgstatic.net/ii/profile.image/277068190371842-1443069612774_Q128/Gert-Faber.jpg",
        });

        // Open the success message modal
        setNewUserSuccessModalOpen(true);

        // Close the success message modal after 2 seconds
        setTimeout(() => {
          setNewUserSuccessModalOpen(false);
        }, 2000);

        // Close the add user modal
        setAddUserModalOpen(false);
      } else {
        console.error("Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("User deleted successfully!");

        // Update the user list in the state
        const updatedUserList = userList.filter((user) => user.id !== userId);
        setUserList(updatedUserList);
      } else {
        console.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <Heading padding={10}>List of Users</Heading>
      <Button
        colorScheme="teal"
        onClick={() => setAddUserModalOpen(true)}
        mb={4}
      >
        Add User
      </Button>

      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Photo (Link)</FormLabel>
              <Input
                type="text"
                name="image"
                value={newUser.image}
                onChange={(e) =>
                  setNewUser({ ...newUser, image: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddUser}>
              Add User
            </Button>
            <Button onClick={() => setAddUserModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Message Modal */}
      <Modal
        isOpen={isNewUserSuccessModalOpen}
        onClose={() => setNewUserSuccessModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="success">
              <AlertIcon />
              User added successfully!
            </Alert>
          </ModalBody>
        </ModalContent>
      </Modal>

      {userList.map((user) => (
        <div key={user.id} className="user">
          <Image
            src={user.image}
            alt={`${user.name}'s image`}
            boxSize="50px"
            borderRadius="full"
            mr={2}
          />
          <h2>
            {user.name}: userID = {user.id}{" "}
            <Button
              colorScheme="red"
              size="xs"
              onClick={() => handleDeleteUser(user.id)}
              ml={2}
            >
              Delete
            </Button>
          </h2>
        </div>
      ))}
    </div>
  );
};
