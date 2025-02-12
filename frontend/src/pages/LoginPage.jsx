// pages/LoginPage.jsx
import { Container, Heading, Input, Button, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    const response = await login(credentials);
    if (response.success) {
      navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: response.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <VStack spacing={4}>
        <Heading>Login</Heading>
        <Input
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <Button onClick={handleLogin}>Login</Button>
        

      </VStack>
    </Container>
  );
};

export default LoginPage;
