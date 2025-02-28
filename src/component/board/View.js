import React, { useState, useEffect, useRef } from "react"; // React 기본 라이브러리와 훅 임포트
import { Link, useNavigate } from "react-router-dom"; // 라우팅 처리를 위한 컴포넌트
import { useSearchParams } from "react-router-dom"; // URL 쿼리 파라미터 처리
import axios from "axios"; // HTTP 클라이언트 라이브러리
import CommentTr from "./CommentTr.js"; // 댓글 행 컴포넌트
import callToken from "../../util/callToken"; // JWT 토큰 관리 유틸리티

function View(props) {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // URL 쿼리 파라미터 추출
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null); // 게시글 데이터 상태
  const no = params.get("no"); // URL에서 게시글 번호 추출

  // 토큰 가져오기
  const token = callToken();
  const authHeader = { Authorization: `Bearer ${token}` }; // 인증 헤더 설정

  // 게시글 상세 조회 함수
  const getView = () => {
    axios
      .get("/api/reply/view?no=" + no, { headers: authHeader })
      .then((res) => {
        setData(res.data); // 게시글 데이터 설정
      });
  };

  // 컴포넌트 마운트 시 게시글 조회
  useEffect(() => {
    getView();
  }, []);

  // 파일 다운로드 URL 생성
  const url =
    data && data.filename_org
      ? "http://localhost:8080/download?filename_org=" +
        encodeURI(data.filename_org) + // 원본 파일명 (URL 인코딩)
        "&filename_real=" +
        data.filename_real // 실제 저장 파일명
      : "#;";

  // 댓글 관련 상태
  const [totalElements, setTotalElements] = useState(0); // 총 댓글 수
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [pageList, setPageList] = useState([]); // 페이지 번호 목록
  const [prevPage, setPrevPage] = useState({}); // 이전 페이지 정보
  const [nextPage, setNextPage] = useState({}); // 다음 페이지 정보
  const [comment, setComment] = useState(null); // 댓글 목록
  const [param, setParam] = useState({
    page: 1, // 초기 페이지
    user_no: 3, // 임시 사용자 번호
    parent_no: Number(no), // 게시글 번호
  });

  // 댓글 목록 조회 함수
  const getCommentList = () => {
    axios
      .get("/api/comment/list", { params: param, headers: authHeader })
      .then((res) => {
        setComment(res.data.result.content); // 댓글 목록 설정
        setTotalElements(res.data.result.totalElements); // 총 댓글 수 설정
        setTotalPages(res.data.result.totalPages); // 총 페이지 수 설정
        setCurrentPage(res.data.result.number + 1); // 현재 페이지 설정
        setPageList(res.data.pageList); // 페이지 목록 설정
        setPrevPage(res.data.prevPage); // 이전 페이지 정보 설정
        setNextPage(res.data.nextPage); // 다음 페이지 정보 설정
      });
  };

  // 컴포넌트 마운트 시 댓글 목록 조회
  useEffect(() => {
    getCommentList();
  }, []);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setParam({
      ...param,
      [e.target.name]: e.target.value, // 입력 필드 이름에 따라 상태 업데이트
    });
  };

  // 댓글 등록 함수
  const saveComment = () => {
    console.log(param);

    axios
      .post("/api/comment/regist", param, { headers: authHeader })
      .then((res) => {
        console.log(res);
        if (res.data.result === "success") {
          alert("정상적으로 저장되었습니다.");
          setParam({
            ...param,
            content: "", // 댓글 내용 초기화
          });
          getCommentList(); // 댓글 목록 갱신
        }
      });
  };

  // 댓글 저장 버튼 클릭 핸들러
  const save = () => {
    if (window.confirm("글을 등록하시겠습니까?")) {
      saveComment(); // 확인 시 댓글 저장
    }
  };

  // 댓글 삭제 함수
  const delComment = (no) => {
    let url = "/api/comment/delete?no=" + no; // 댓글 삭제 API URL
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      axios.get(url, { headers: authHeader }).then((res) => {
        if (res.data.result === "success") {
          alert("정상적으로 삭제되었습니다.");
          getCommentList(); // 댓글 목록 갱신
        }
      });
    }
  };

  // 게시글 수정 페이지로 이동
  const goEdit = (e) => {
    e.preventDefault();
    navigate("/board/edit?no=" + no);
  };

  // 답변 작성 페이지로 이동
  const goReply = (e) => {
    e.preventDefault();
    navigate("/board/reply?no=" + no);
  };

  // 게시글 삭제 함수
  const goDelete = (e) => {
    if (window.confirm("삭제하시겠습니까?")) {
      axios
        .post("/api/reply/delete", { no: Number(no) }, { headers: authHeader })
        .then((res) => {
          if (res.data.result === "success") {
            alert("정상적으로 삭제되었습니다.");
            navigate("/board/list"); // 목록 페이지로 이동
          }
        });
    } else {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="sub">
        <div className="size">
          <h3 className="sub_title">게시판</h3>
          <div className="bbs">
            <div className="view">
              <div className="title">
                <dl>
                  <dt>{data && data.title}</dt> {/* 게시글 제목 */}
                  <dd className="date">
                    작성일 : {data && data.writedate.substring(0, 10)}{" "}
                    {/* 작성일 */}
                  </dd>
                </dl>
              </div>
              <div className="cont">
                {/* 게시글 내용 (HTML 형식 지원) */}
                <p
                  dangerouslySetInnerHTML={{ __html: data && data.content }}
                ></p>
              </div>
              <dl className="file">
                <dt>첨부파일 </dt>
                <dd>
                  {data && data.filename_org ? (
                    // 첨부파일이 있는 경우 다운로드 링크 표시
                    <a href={url} target="_blank">
                      {data.filename_org}
                    </a>
                  ) : null}
                </dd>
              </dl>

              <div className="btnSet clear">
                <div className="fl_l">
                  <Link to="/board/list" className="btn">
                    목록
                  </Link>
                  <Link onClick={goReply} className="btn">
                    답변
                  </Link>
                  <Link onClick={goEdit} className="btn">
                    수정
                  </Link>
                  <Link onClick={goDelete} className="btn">
                    삭제
                  </Link>
                </div>
              </div>
            </div>

            {/* 댓글 영역 */}
            <div>
              {/* 댓글 입력 폼 */}
              <table className="board_write">
                <colgroup>
                  <col width="*" />
                  <col width="100px" />
                </colgroup>
                <tbody>
                  <tr>
                    <td>
                      <textarea
                        name="content"
                        style={{ height: "50px" }}
                        onChange={handleChange}
                        value={param.content}
                      ></textarea>
                    </td>
                    <td>
                      <div className="btnSet" style={{ textAlign: "right" }}>
                        <a className="btn" href="#;" onClick={save}>
                          저장
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 댓글 통계 */}
              <p>
                <span>
                  <strong>총 {totalElements}개</strong> | {currentPage}/
                  {totalPages}
                </span>
              </p>

              {/* 댓글 목록 */}
              <table className="list">
                <colgroup>
                  <col width="80px" />
                  <col width="*" />
                  <col width="100px" />
                  <col width="100px" />
                </colgroup>
                <tbody>
                  {comment ? (
                    // 댓글이 있는 경우 목록 표시
                    comment.map((row, i) => (
                      <CommentTr row={row} key={i} delComment={delComment} />
                    ))
                  ) : (
                    // 댓글이 없는 경우 메시지 표시
                    <tr>
                      <td className="first" colSpan="4">
                        등록된 댓글이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* 댓글 페이지네이션 */}
              <div className="pagenate clear">
                <ul className="paging">
                  {prevPage !== null ? (
                    <li>
                      <Link
                        onClick={() =>
                          setParam({
                            ...param,
                            page: prevPage.pageNumber + 1, // 이전 페이지로 이동
                          })
                        }
                      >
                        &lt;
                      </Link>
                    </li>
                  ) : null}

                  {pageList
                    ? pageList.map((e, i) => (
                        <li key={i}>
                          <Link
                            className={
                              e.pageNumber === currentPage - 1 ? "current" : "" // 현재 페이지 강조
                            }
                            onClick={() =>
                              setParam({
                                ...param,
                                page: e.pageNumber + 1, // 선택한 페이지로 이동
                              })
                            }
                          >
                            {e.pageNumber + 1}
                          </Link>
                        </li>
                      ))
                    : ""}
                  {nextPage !== null ? (
                    <li>
                      <Link
                        onClick={() =>
                          setParam({
                            ...param,
                            page: nextPage.pageNumber + 1, // 다음 페이지로 이동
                          })
                        }
                      >
                        &gt;
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default View;
