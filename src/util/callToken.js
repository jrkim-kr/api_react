import axios from "axios";

const callToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("accessToken:" + accessToken);

  if (!accessToken) {
    axios
      .post("/auth", {
        client_id: "client_id",
        client_secret: "client_secret",
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("accessToken", response.data.accessToken);
        if (response.status === 401 || response.status === 403) {
          alert("인증 정보가 올바르지 않습니다.");
        }
      });
  } else {
    return accessToken;
  }
};

export default callToken;
