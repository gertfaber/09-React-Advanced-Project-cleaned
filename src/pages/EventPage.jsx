import React, { useState } from "react";
import {
  Text,
  Card,
  CardBody,
  Heading,
  Image,
  Grid,
  Box,
  Button,
  Flex,
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
  Center,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";

export const Eventloader = async ({ params }) => {
  const users = await fetch("http://localhost:3000/users");
  const event = await fetch(`http://localhost:3000/events/${params.id}`);
  const categories = await fetch("http://localhost:3000/categories");

  return {
    users: await users.json(),
    event: await event.json(),
    categories: await categories.json(),
  };
};

export const EventPage = () => {
  const { users, event: initialEvent, categories } = useLoaderData(Eventloader);
  // const eventCreator = users[initialEvent.createdBy - 1];
  const [eventCreator, setEventCreator] = useState(
    users[initialEvent.createdBy - 1]
  );

  const [event, setEvent] = useState(initialEvent);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editedCreator, setEditedCreator] = useState(
    users[initialEvent.createdBy - 1]
  );

  const navigate = useNavigate();

  const handleEditClick = () => {
    setEditModalOpen(true);
    setEditedEvent({ ...event });
  };

  const handleSaveEdit = async () => {
    try {
      // Perform the save operation to the server with editedEvent data
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedEvent),
      });

      // Check if the update operation was successful (status code 200)
      if (response.ok) {
        // Update the local state with the edited event
        setEvent(editedEvent);
        setEditModalOpen(false); // Close the modal after saving
        setEventCreator(editedCreator);
      } else {
        console.error("Error saving event. Server response:", response.status);
        // Handle error cases if needed
      }
    } catch (error) {
      console.error("Error saving event:", error);
      // Handle error cases if needed
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryIds") {
      // Convert the comma-separated string to an array of numbers
      const idsArray = value
        .split(",")
        .map((id) => (id.trim() !== "" ? parseInt(id.trim(), 10) : null))
        .filter((id) => id !== null);
      setEditedEvent((prevEvent) => ({
        ...prevEvent,
        [name]: idsArray,
      }));
    } else if (name === "createdBy") {
      const value_num = parseInt(value, 10);
      setEditedEvent((prevEvent) => ({
        ...prevEvent,
        [name]: value_num,
      }));
    } else {
      setEditedEvent((prevEvent) => ({
        ...prevEvent,
        [name]: value,
      }));
    }

    // Update eventCreator if createdBy is changed
    if (name === "createdBy") {
      const updatedEventCreator = users.find(
        (user) => user.id === parseInt(value, 10)
      );
      setEditedCreator(updatedEventCreator);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Perform the delete operation on the server
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });

      // Check if the delete operation was successful (status code 200)
      if (response.ok) {
        // Redirect to the main events list page after successful delete
        navigate("/");
      } else {
        console.error(
          "Error deleting event. Server response:",
          response.status
        );
        // Handle error cases if needed
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      // Handle error cases if needed
    }
  };

  return (
    <>
      <Box flexDir="column" padding={10} border="1px solid #000" w="100%">
        <Center flexDir="column" w="100%" border="1px solid #000" padding={10}>
          <Card bg="gray.100" w={"100%"}>
            <CardBody textAlign="left" borderRadius="lg">
              <Image
                src={event.image}
                borderRadius="lg"
                h="300px"
                w={"100%"}
                objectFit="cover"
                padding={0}
              />

              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                }}
                gap={4}
              >
                <Box textAlign="left">
                  <Heading fontSize="30px" mb={4}>
                    Event Information
                  </Heading>
                  <Heading fontSize="25px" mb={4}>
                    {event.title}
                  </Heading>
                  <Text fontWeight="bold" fontSize="20px">
                    Location:{" "}
                  </Text>
                  <Text mb={4}>{event.location}</Text>
                  <Text fontWeight="bold" fontSize="20px">
                    Description:{" "}
                  </Text>
                  <Text mb={4}>{event.description}</Text>
                  <Text style={{ fontWeight: "bold" }} fontSize="20px">
                    Start Time:
                  </Text>
                  <Text fontSize="16px">
                    {event.startTime.slice(0, 10)} {"/"}{" "}
                    {event.startTime.slice(11, 16)}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>End Date/Time:</Text>
                  <Text fontSize="16px" mb={2}>
                    {event.endTime.slice(0, 10)} {"/"}{" "}
                    {event.endTime.slice(11, 16)}
                  </Text>
                  <Text fontWeight="bold" fontSize="20px">
                    Categories:{" "}
                  </Text>
                  <Flex wrap="wrap" justify="left">
                    {event.categoryIds.map((categoryId, index) => (
                      <Text
                        fontSize={16}
                        bg={"green.200"}
                        key={index}
                        borderRadius="md"
                        padding="1"
                        margin={1}
                      >
                        {categories[categoryId - 1].name}
                      </Text>
                    ))}
                  </Flex>
                </Box>

                <Box>
                  <Heading fontSize="30px" mb={4}>
                    Organizer Information
                  </Heading>
                  <Heading fontSize="25px" mb={2}>
                    {eventCreator.name}
                  </Heading>
                  <Image
                    src={eventCreator.image}
                    borderRadius="lg"
                    h="180px"
                    w={"50%"}
                    objectFit="cover"
                    padding={0}
                  />
                </Box>
              </Grid>
            </CardBody>
          </Card>

          {/* Edit Button */}
          <Button colorScheme="teal" mt={4} onClick={handleEditClick}>
            Edit Event
          </Button>

          {/* Delete Button */}
          <Button colorScheme="red" mt={4} onClick={handleDeleteClick}>
            Delete Event
          </Button>

          {/* Edit Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Event</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mt={4}>
                  <FormLabel>Organizer ID (check/add @ Users page)</FormLabel>
                  <Input
                    type="number"
                    name="createdBy"
                    value={editedEvent.createdBy}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    name="title"
                    value={editedEvent.title}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    value={editedEvent.description}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Image</FormLabel>
                  <Input
                    type="text"
                    name="image"
                    value={editedEvent.image}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Category ID (check/add @ Category page)</FormLabel>
                  <Input
                    type="text"
                    name="categoryIds"
                    value={editedEvent.categoryIds.join(", ")}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Location</FormLabel>
                  <Input
                    type="text"
                    name="location"
                    value={editedEvent.location}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="datetime-local"
                    name="startTime"
                    value={editedEvent.startTime}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="datetime-local"
                    name="endTime"
                    value={editedEvent.endTime}
                    onChange={handleChange}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Are you sure you want to delete this event?</ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
                <Button onClick={() => setDeleteModalOpen(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Center>
      </Box>
    </>
  );
};
