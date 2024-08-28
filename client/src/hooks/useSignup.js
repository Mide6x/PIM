import { useState } from "react";
import { message } from "antd";
import useAuth from "../contexts/useAuth";

const useSignUp = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerUser = async (values) => {
    if (values.password !== values.passwordConfirm) {
      return setError("Your passwords do not match, lol. 😆");
    }

    try {
      setError(null);
      setLoading(true);

      const res = await fetch("https://prod-nnal.onrender.com/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status === 201) {
        message.success(data.message);
        login(data.token, data.user);
      } else if (res.status === 400) {
        setError(data.message);
      } else {
        message.error(
          "Oops! That didn't work, let's try again or contact admin 🤓"
        );
      }
    } catch (error) {
      message.error("An unexpected error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerUser };
};

export default useSignUp;
