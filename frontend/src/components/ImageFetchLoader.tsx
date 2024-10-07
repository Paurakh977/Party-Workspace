import React, { useEffect } from "react";
import axios from "axios";

interface Settings {
  settingId: number;
  icon: string | null;
  carousel1: string | null;
  carousel2: string | null;
  carousel3: string | null;
  carousel4: string | null;
  carousel5: string | null;
}

const ImageFetchLoader = () => {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BE_HOST + "/settings/get-full/1",
        );
        setSettings(response.data);
      } catch (error) {
        setErrorMessage("Error fetching the image. Please try again.");
        console.error("Error fetching image:", error);
      }
    };
    fetchSettings();
  }, []);

  return settings;
};

export default ImageFetchLoader;
