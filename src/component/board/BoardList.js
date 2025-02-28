/*
게시글 목록을 보여주는 컴포넌트
*/

import React, { useState, useEffect, useRef } from "react"; // React 기본 라이브러리와 훅 임포트
import axios from "axios"; // HTTP 클라이언트 라이브러리
import BoardTr from "./BoardTr"; // 게시글 행 컴포넌트
import { Link } from "react-router-dom"; // 라우팅 처리를 위한 컴포넌트
import callToken from "../../util/callToken"; // JWT 토큰 관리 유틸리티

function BoardList() {
  const [data, setData] = useState(null); // 게시글 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [totalElements, setTotalElements] = useState(0); // 전체 게시글 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [pageList, setPageList] = useState([]); // 페이지 번호 목록
  const [prevPage, setPrevPage] = useState({}); // 이전 페이지 정보
  const [nextPage, setNextPage] = useState({}); // 다음 페이지 정보
  const [param, setParam] = useState({
    page: 1, // 초기 페이지 번호
  });
  let searchType = useRef(null); // 검색 타입 참조 (제목, 내용, 전체)
  let searchWord = useRef(null); // 검색어 참조

  // API 호출 함수
  const getApi = async () => {
    // JWT 토큰 가져오기
    const token = await callToken();
    const authHeader = { Authorization: `Bearer ${token}` }; // 인증 헤더 설정

    if (!token) {
      console.error("🚨 토큰을 가져올 수 없습니다.");
      return;
    }

    try {
      // 토큰을 포함한 API 요청 실행
      await axios
        .get("/api/reply/list", { params: param, headers: authHeader })
        .then((res) => {
          setData(res.data.result.content); // 게시글 데이터 설정
          setTotalElements(res.data.result.totalElements); // 전체 게시글 수 설정
          setTotalPages(res.data.result.totalPages); // 전체 페이지 수 설정
          setCurrentPage(res.data.result.number + 1); // 현재 페이지 설정 (0부터 시작하므로 +1)
          setPageList(res.data.pageList); // 페이지 목록 설정
          setPrevPage(res.data.prevPage); // 이전 페이지 정보 설정
          setNextPage(res.data.nextPage); // 다음 페이지 정보 설정
          setLoading(false); // 로딩 완료
        });
    } catch (error) {
      console.error("❌ API 요청 실패:", error);
      sessionStorage.removeItem("accessToken"); // 오류 시 토큰 제거
    }
  };

  // 컴포넌트 마운트 시와 param 변경 시 API 호출
  useEffect(() => {
    getApi();
  }, [param]);

  // 검색 처리 함수
  const search = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    setParam({
      ...param,
      searchType: searchType.current.value, // 검색 타입 설정
      searchWord: searchWord.current.value, // 검색어 설정
    });
    // param이 변경되면서 useEffect에 의해 getApi() 자동 호출
  };

  return (
    <>
      <div className="sub">
        <div className="size">
          <h3 className="sub_title">게시판</h3>

          <div className="bbs">
            <p>
              <span>
                <strong>총 {totalElements}개</strong> | {currentPage}/
                {totalPages}
                페이지
              </span>
            </p>
            <table className="list">
              <caption>게시판 목록</caption>
              <colgroup>
                <col width="80px" />
                <col width="*" />
                <col width="80px" />
                <col width="100px" />
                <col width="100px" />
              </colgroup>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>조회수</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // 로딩 중일 때 표시할 내용
                  <tr>
                    <td colSpan="5">
                      <div>
                        <img
                          src="/img/loading.gif"
                          alt="로딩 중..."
                          width="50"
                        />
                        <p>
                          <b>데이터를 불러오는 중입니다...</b>
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : data ? (
                  // 데이터가 있을 때 게시글 목록 표시
                  data.map((row, i) => <BoardTr row={row} key={i} />)
                ) : (
                  // 데이터가 없을 때 표시할 내용
                  <tr>
                    <td className="first" colSpan="5">
                      등록된 글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="btnSet" style={{ textAlign: "right" }}>
              <Link className="btn" to="/board/regist">
                글작성
              </Link>
            </div>
            {/* 페이지네이션 UI */}
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

            {/* 검색 폼 */}
            <div className="bbsSearch">
              <form
                method="get"
                name="searchForm"
                id="searchForm"
                onSubmit={search}
              >
                <span className="srchSelect">
                  <select
                    id="stype"
                    name="stype"
                    className="dSelect"
                    title="검색분류 선택"
                    ref={searchType} // useRef로 참조
                    onChange={search} // 검색 타입 변경 시 검색 실행
                  >
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                  </select>
                </span>
                <span className="searchWord">
                  <input
                    type="text"
                    id="sval"
                    name="sval"
                    title="검색어 입력"
                    ref={searchWord} // useRef로 참조
                  />
                  <input
                    type="button"
                    id=""
                    value="검색"
                    title="검색"
                    onClick={search} // 검색 버튼 클릭 시 검색 실행
                  />
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BoardList;
