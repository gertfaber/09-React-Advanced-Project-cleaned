import React, { useState } from "react";
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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export const categoriesListLoader = async () => {
  const categories = await fetch("http://localhost:3000/categories");

  return { categories: await categories.json() };
};

export const CategoriesPage = () => {
  const { categories } = useLoaderData();
  // console.log(categories);

  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [isNewCategorySuccessModalOpen, setNewCategorySuccessModalOpen] =
    useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "Dummy Category #1",
  });

  const [categoryList, setCategoryList] = useState(categories);

  const handleAddCategory = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        console.log("Category added successfully!");

        // Fetch the updated category list
        const updatedCategoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        const updatedCategoryList = await updatedCategoriesResponse.json();

        // Update the category list in the state
        setCategoryList(updatedCategoryList);

        // Clear the input field
        setNewCategory({
          name: "Dummy Category #?",
        });

        // Open the success message modal
        setNewCategorySuccessModalOpen(true);

        // Close the success message modal after 2 seconds
        setTimeout(() => {
          setNewCategorySuccessModalOpen(false);
        }, 2000);

        // Close the add category modal
        setAddCategoryModalOpen(false);
      } else {
        console.error("Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Category deleted successfully!");

        // Update the category list in the state
        const updatedCategoryList = categoryList.filter(
          (category) => category.id !== categoryId
        );
        setCategoryList(updatedCategoryList);
      } else {
        console.error("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="category-list">
      <Heading padding={10}>List of Categories</Heading>
      <Button
        colorScheme="teal"
        onClick={() => setAddCategoryModalOpen(true)}
        mb={4}
      >
        Add Category
      </Button>

      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddCategory}>
              Add Category
            </Button>
            <Button onClick={() => setAddCategoryModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Message Modal */}
      <Modal
        isOpen={isNewCategorySuccessModalOpen}
        onClose={() => setNewCategorySuccessModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="success">
              <AlertIcon />
              Category added successfully!
            </Alert>
          </ModalBody>
        </ModalContent>
      </Modal>

      {categoryList.map((category) => (
        <div key={category.id} className="category">
          <Heading as="h2" size="md">
            {category.name}
          </Heading>
          <p>Category ID: {category.id}</p>
          <Button
            colorScheme="red"
            size="xs"
            onClick={() => handleDeleteCategory(category.id)}
            ml={2}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};
