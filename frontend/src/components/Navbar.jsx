// components/Navbar.jsx
import { Button, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/user";

const Navbar = () => {
  const { isAuthenticated, logout } = useUserStore();
  const { isAdmin } = useUserStore(); // Check if the user is admin

  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}>Comic Book Shop💭</Link>
        </Text>

        <HStack spacing={2} alignItems={"center"}>
          {isAuthenticated ? (
            <>
              {isAdmin ? (<Link to={"/create"}>
                <Button>
                  <PlusSquareIcon fontSize={20} />
                </Button>
              </Link>) : ""}

              <Link to="/cart">
                <Button>Cart</Button>
              </Link>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <div>
              <Link to={"/login"}>
                <Button mr={3}>Login</Button>
              </Link>
              <Link to={"/register"}>
                <Button>Register</Button>
              </Link>
            </div>


          )}
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
