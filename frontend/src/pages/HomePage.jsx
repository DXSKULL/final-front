// HomePage.jsx
import { Container, SimpleGrid, Text, VStack, Input, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/product";
import { useUserStore } from "../store/user"; // Import user store
import ProductCard from "../components/ProductCard";
import React from "react";

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [recommendations, setRecommendations] = useState([]); // Store recommendations

  useEffect(() => {
    fetchProducts();
    if (user) fetchRecommendations(user.id); // Fetch recommendations for the logged-in user
  }, [fetchProducts, user]);

  // Fetch recommended products based on the user's past orders
  const fetchRecommendations = async (userId) => {
    try {
      const res = await fetch(`/api/recommendations/${userId}`);
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text fontSize="30" fontWeight="bold" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text" textAlign="center">
          Current Comic Books 🚀
        </Text>
        
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} w="full">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        {visibleCount < filteredProducts.length && (
          <Button onClick={handleShowMore} colorScheme="blue" mt={4}>
            Show More
          </Button>
        )}

        {filteredProducts.length === 0 && (
          <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
            No products found 😢
          </Text>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <VStack align="start" w="full" mt={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Recommendations for You</Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} w="full">
              {recommendations.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
