import { Heading, Text, Image, Card, CardBody, Flex } from "@chakra-ui/react";

export const EventCardComp = ({ event, categories }) => {
  return (
    <>
      <Card bg="gray.100" h="450px">
        <CardBody textAlign="center" borderRadius="lg">
          <Image
            src={event.image}
            borderRadius="lg"
            h="130px"
            w={"100%"}
            objectFit="cover"
            padding={0}
          />
          <Heading mb={4} fontSize="20px">
            {event.title}
          </Heading>
          <Text fontWeight="bold">Description: </Text>
          <Text mb={4} fontSize="14px">
            {event.description.split(" ").slice(0, 4).join(" ")}
          </Text>

          <Text style={{ fontWeight: "bold" }}>Start Time:</Text>
          <Text fontSize="14px">
            {event.startTime.slice(0, 10)} {"/"} {event.startTime.slice(11, 16)}
          </Text>
          <Text style={{ fontWeight: "bold" }}>End Date/Time:</Text>
          <Text fontSize="14px" mb={2}>
            {event.endTime.slice(0, 10)} {"/"} {event.endTime.slice(11, 16)}
          </Text>
          <Text fontWeight="bold">Categories: </Text>
          <Flex wrap="wrap" justify="center">
            {event.categoryIds.map((categoryId, index) => (
              <Text
                fontSize={10}
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
        </CardBody>
      </Card>
    </>
  );
};
