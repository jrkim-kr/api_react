import React, { useState, useEffect } from "react"; // React 기본 라이브러리와 훅 임포트
import { Link, useNavigate } from "react-router-dom"; // 라우팅 처리를 위한 컴포넌트
import axios from "axios"; // HTTP 클라이언트 라이브러리
import callToken from "../../util/callToken"; // JWT 토큰 관리 유틸리티

function Regist() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [param, setParam] = useState({
    user_no: 3, // 임시 사용자 번호
  });
  const [file, setFile] = useState([]); // 파일 상태

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setParam({
      ...param,
      [e.target.name]: e.target.value, // 입력 필드 이름에 따라 상태 업데이트
    });
  };

  // 파일 변경 핸들러
  const handleChangeFile = (e) => {
    setFile(Array.from(e.target.files)); // FileList를 배열로 변환
  };

  // 게시글 등록 API 호출
  const getApi = async () => {
    // JWT 토큰 가져오기
    const token = await callToken();

    console.log(param);
    const formData = new FormData(); // 멀티파트 폼 데이터 생성

    // 파일 데이터 추가
    file.map((f) => {
      formData.append("file", f);
    });

    // 게시글 데이터 추가
    for (let k in param) {
      formData.append(k, param[k]);
    }
    console.log(Array.from(formData));

    // API 요청
    axios
      .post("/api/reply/regist", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 멀티파트 폼 데이터 헤더
          charset: "utf-8",
          Authorization: `Bearer ${token}`, // JWT 토큰 헤더
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.result === "success") {
          alert("정상적으로 저장되었습니다.");
          navigate("/board/list"); // 목록 페이지로 이동
        }
      });
  };

  // 저장 버튼 클릭 핸들러
  const save = () => {
    if (window.confirm("글을 등록하시겠습니까?")) {
      getApi(); // 확인 시 API 호출
    }
  };

  return (
    <>
      <div className="sub">
        <div className="size">
          <h3 className="sub_title">게시판</h3>

          <div className="bbs">
            <form
              method="post"
              name="frm"
              id="frm"
              action=""
              encType="multipart/form-data"
            >
              <table className="board_write">
                <tbody>
                  <tr>
                    <th>제목</th>
                    <td>
                      <input type="text" name="title" onChange={handleChange} />
                    </td>
                  </tr>
                  <tr>
                    <th>내용</th>
                    <td>
                      <textarea
                        name="content"
                        onChange={handleChange}
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th>파일</th>
                    <td>
                      <input
                        type="file"
                        id="file"
                        onChange={handleChangeFile}
                      ></input>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btnSet" style={{ textAlign: "right" }}>
                <Link className="btn" onClick={save}>
                  저장
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Regist;
