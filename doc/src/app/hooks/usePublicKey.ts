import { useEffect, useState } from "react";

const usePublicKey = () => {
  const [publicKey, setPublicKey] = useState<null | string>(null);

  useEffect(() => {
    const fetchPublicKey = async () => {
      const response = await fetch("https://developer.geops.io/publickey");
      const data = await response.json();
      setPublicKey(data?.key);
    };

    fetchPublicKey();
  }, []);

  return publicKey;
};

export default usePublicKey;
