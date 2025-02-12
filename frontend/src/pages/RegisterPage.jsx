// RegisterPage.jsx
import { Container, Heading, Input, Button, VStack, useToast, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [userDetails, setUserDetails] = useState({ email: "", password: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const register = useUserStore((state) => state.register);
  const navigate = useNavigate();
  const toast = useToast();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[%$&@_]).{6,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(userDetails.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    
    setEmailError("");
    
    if (userDetails.password !== userDetails.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", status: "error", isClosable: true });
      return;
    }
    
    if (!validatePassword(userDetails.password)) {
      setPasswordError("Password must contain at least 1 capital letter, 1 number, and 1 special symbol (%$&@_).")
      return;
    }
    
    setPasswordError("");
    const response = await register({ email: userDetails.email, password: userDetails.password });
    
    if (response.success) {
      navigate("/");
    } else {
      toast({ title: "Registration Failed", description: response.message, status: "error", isClosable: true });
    }
  };

  return (
    <Container>
      <VStack spacing={4}>
        <Heading>Register</Heading>
        <Input placeholder="Email" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} />
        {emailError && <Text color="red.500">{emailError}</Text>}
        <Input placeholder="Password" type="password" value={userDetails.password} onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} />
        {passwordError && <Text color="red.500">{passwordError}</Text>}
        <Input placeholder="Confirm Password" type="password" value={userDetails.confirmPassword} onChange={(e) => setUserDetails({ ...userDetails, confirmPassword: e.target.value })} />
        <Button onClick={handleRegister}>Register</Button>
      </VStack>
    </Container>
  );
};

export default RegisterPage;
