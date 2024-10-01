import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  credits: number;
}

const CreditsDeduct = async (costingCredits: number): Promise<void> => {
  try {
    // Retrieve token from local storage
    const token = Cookies.get("token");

    // Check if token exists
    if (!token) {
      console.error("Token not found");
      return;
    }

    // Decode the token
    const decoded: DecodedToken = jwtDecode(token);

    const updatedCredits = decoded.credits - costingCredits;

    // Return the user's role
    axios.put(process.env.NEXT_PUBLIC_BE_HOST + `/users/${decoded.userId}`, {
      credits: updatedCredits,
    });
  } catch (error) {
    // Handle token decoding error (e.g., invalid token)
    console.error("Error decoding token:", error);
    return;
  }
};

export default CreditsDeduct;
