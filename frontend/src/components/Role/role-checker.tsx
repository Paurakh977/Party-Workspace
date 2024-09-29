import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  credits: number;
}

const RoleChecker = (): string | null => {
  try {
    // Retrieve token from local storage
    const token = Cookies.get("token");

    // Check if token exists
    if (!token) {
      console.error("Token not found");
      return null;
    }

    // Decode the token
    const decoded: DecodedToken = jwtDecode(token);

    // Return the user's role
    return decoded.role;
  } catch (error) {
    // Handle token decoding error (e.g., invalid token)
    console.error("Error decoding token:", error);
    return null;
  }
};

export default RoleChecker;
