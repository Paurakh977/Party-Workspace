import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  credits: number;
}

const CreditsChecker = (): number | 0 => {
  try {
    // Retrieve token from local storage
    const token = Cookies.get("token");

    // Check if token exists
    if (!token) {
      console.error("Token not found");
      return 0;
    }

    // Decode the token
    const decoded: DecodedToken = jwtDecode(token);

    // Return the user's role
    return decoded.credits;
  } catch (error) {
    // Handle token decoding error (e.g., invalid token)
    console.error("Error decoding token:", error);
    return 0;
  }
};

export default CreditsChecker;
