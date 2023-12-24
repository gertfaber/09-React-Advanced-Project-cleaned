import React, { useState, useEffect } from "react";
import {
  Heading,
  Grid,
  Box,
  Button,
  Center,
  Input,
  Checkbox,
  CheckboxGroup,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";
import { EventCardComp } from "../components/EventCardComp.jsx";

export const eventsListLoader = async () => {
  const users = await fetch("http://localhost:3000/users");
  const events = await fetch("http://localhost:3000/events");
  const categories = await fetch("http://localhost:3000/categories");

  return {
    users: await users.json(),
    events: await events.json(),
    categories: await categories.json(),
  };
};

export const EventsPage = () => {
  const { events: initialEvents, categories } = useLoaderData();

  const [events, setEvents] = useState(initialEvents);
  const [searchField, setSearchField] = useState("");
  const allCategoryIds = categories.map((category) => category.id);
  const [selectedCategories, setSelectedCategories] = useState(allCategoryIds);

  const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [newEvent, setNewEvent] = useState({
    createdBy: 3,
    title: "Dummy Event",
    description:
      "dummy description dummy description dummy description dummy description dummy description",
    image:
      "https://cdn-az.allevents.in/events7/banners/4def3faa0b175ce0484c447f3488583f9bda9c2e10041b728f0d04d3bca9da03-rimg-w960-h497-gmir.jpg",
    categoryIds: [1],
    location: "Dummy Location",
    startTime: "2023-03-10T18:00",
    endTime: "2023-03-10T17:00",
  });

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected);
  };

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`http://localhost:3000/events/${eventToDelete}`, {
        method: "DELETE",
      });

      // Update the events after deletion
      const updatedEvents = events.filter(
        (event) => event.id !== eventToDelete
      );
      // Update the state
      setEvents(updatedEvents);

      // Close the delete confirmation modal
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        console.log("Event added successfully!");

        // Fetch the updated event list
        const updatedEventsResponse = await fetch(
          "http://localhost:3000/events"
        );
        const updatedEventList = await updatedEventsResponse.json();

        // Update the event list in the state
        setEvents(updatedEventList);

        // Clear the input fields and close the modal
        setNewEvent({
          createdBy: 3,
          title: "Dummy Event",
          description: "dummy dummy dummy dummy dummy dummy dummy dummy dummy",
          image:
            "https://cdn-az.allevents.in/events7/banners/4def3faa0b175ce0484c447f3488583f9bda9c2e10041b728f0d04d3bca9da03-rimg-w960-h497-gmir.jpg",
          categoryIds: [1],
          location: "Dummy Location",
          startTime: "2023-03-10T18:00",
          endTime: "2023-03-10T17:00",
        });
        setAddEventModalOpen(false);
      } else {
        console.error("Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const matchedEvents = events.filter((event) => {
    selectedCategories.forEach((cat, index, arr) => {
      arr[index] = +cat;
    });
    return (
      event.title.toLowerCase().includes(searchField.toLowerCase()) &&
      selectedCategories.some((catId) => event.categoryIds.includes(catId))
    );
  });

  return (
    <Box
      flexDir="column"
      padding={1}
      // border="1px solid #000"
      w="100%"
    >
      <Center
        flexDir="column"
        w="100%"
        // border="1px solid #000"
        padding={10}
      >
        <Heading paddingBottom="4">List of Events</Heading>
        <Box paddingBottom="4">
          <Input
            p="2"
            bg="white"
            type="text"
            padding="10px"
            placeholder="Search Events"
            onChange={handleChange}
          />
        </Box>

        <CheckboxGroup
          colorScheme="green"
          onChange={handleCategoryChange}
          value={selectedCategories}
        >
          <Stack spacing={[1, 5]} direction={["column", "row"]}>
            {categories.map((category) => (
              <Checkbox key={category.id} value={category.id}>
                {category.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>

        <Button
          colorScheme="teal"
          mb={4}
          onClick={() => setAddEventModalOpen(true)}
        >
          Add Event
        </Button>

        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
            "2xl": "repeat(5, 1fr)",
          }}
          gap="2"
        >
          {matchedEvents.map((event) => (
            <Box key={event.id} borderRadius="lg" bg="gray.100">
              <EventCardComp
                key={event.id}
                event={event}
                categories={categories}
                onDelete={() => handleDeleteEvent(event.id)}
              />
              <Button border="1px solid" bg="white" margin="1">
                <Link to={`event/${event.id}`}>Details</Link>
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteEvent(event.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Grid>
      </Center>

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setAddEventModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Dummy Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Organizer ID (check/add @ Users page)</FormLabel>
              <Input
                type="number"
                name="createdBy"
                value={newEvent.createdBy}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, createdBy: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                name="description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image (Link)</FormLabel>
              <Input
                type="text"
                name="image"
                value={newEvent.image}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, image: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Category ID (check/add @ Category page)</FormLabel>
              <Input
                type="number"
                name="categoryIds"
                value={newEvent.categoryIds}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    categoryIds: [parseInt(e.target.value, 10)],
                  })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={newEvent.startTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startTime: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={newEvent.endTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endTime: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddEvent}>
              Add Event
            </Button>
            <Button onClick={() => setAddEventModalOpen(false)}>Cancel</Button>
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
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
