import { useAuth } from "../contexts/AuthContext";

const useSignUp = () => {
  const { login } = useAuth;
  const [error, setError] = useState(null);

  return {};
};

export default useSignUp;
