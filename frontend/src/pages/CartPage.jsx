// pages/CartPage.jsx
import { useEffect, useMemo } from "react";
import { Box, Button, Text, VStack, HStack, Divider, Heading, Spacer } from "@chakra-ui/react";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { user } = useUserStore();
  const { cart, fetchCart, placeOrder, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart(user.id);
  }, [user, fetchCart]);

  const total = useMemo(
    () => cart.reduce((sum, { productId, quantity }) => sum + productId.price * quantity, 0),
    [cart]
  );

  const handlePlaceOrder = async () => {
    const result = await placeOrder(user.id);
    if (result.success) {
      navigate("/"); // Redirect after placing order
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(user.id, productId);
  };

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <Heading mb={6} textAlign="center">Your Cart</Heading>

      <VStack spacing={4} align="stretch">
        {cart && cart.length > 0 ? (
          cart.map(({ productId, quantity }) => (
            <Box key={productId._id} p={4} borderWidth="1px" borderRadius="lg" shadow="sm">
              <HStack>
                <VStack align="start">
                  <Text fontSize="lg" fontWeight="bold">{productId.name}</Text>
                  <Text color="gray.600">Price: ${productId.price.toFixed(2)}</Text>
                  <Text color="gray.600">Quantity: {quantity}</Text>
                </VStack>
                <Spacer />
                <VStack align="end">
                  <Text fontSize="lg" fontWeight="bold">${(productId.price * quantity).toFixed(2)}</Text>
                  <Button size="sm" colorScheme="red" onClick={() => handleRemove(productId._id)}>
                    Remove
                  </Button>
                </VStack>
              </HStack>
            </Box>
          ))
        ) : (
          <Text fontSize="lg" textAlign="center">Your cart is empty</Text>
        )}
      </VStack>

      <Divider my={6} />

      <HStack>
        <Text fontSize="xl" fontWeight="bold">Total:</Text>
        <Spacer />
        <Text fontSize="xl" fontWeight="bold">${total.toFixed(2)}</Text>
      </HStack>

      {cart && cart.length > 0 && (
        <Button mt={6} colorScheme="blue" size="lg" width="full" onClick={handlePlaceOrder}>
          Purchase
        </Button>
      )}
    </Box>
  );
};

export default CartPage;
