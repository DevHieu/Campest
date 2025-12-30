import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Loading from "../../components/Loading";

export default function OAuth2Redirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["token"]);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // lưu token
    setCookie("token", token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // về home
    navigate("/");
  }, []);

  return <Loading />;
}
