import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type MyComponentProps = {
  Home: React.FC;
};

const Protected = ({ Home }: MyComponentProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== "ankit.ganatra")
      navigate("/login");
  }, []);

  return (
    <>
      <Home />
    </>
  );
};

export default Protected;