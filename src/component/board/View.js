import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CommentTr from "./CommentTr.js";
import callToken from "../../util/callToken";

function View(props) {
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const no = params.get("no");
  // 토큰
  const token = callToken();
  const authHeader = { Authorization: `Bearer ${token}` };
  const getView = () => {
    axios
      .get("/api/reply/view?no=" + no, { headers: authHeader })
      .then((res) => {
        setData(res.data);
      });
  };
  useEffect(() => {
    getView();
  }, []);

  const url =
    data && data.filename_org
      ? "http://localhost:8080/download?filename_org=" +
        encodeURI(data.filename_org) +
        "&filename_real=" +
        data.filename_real
      : "#;";

  // 댓글관련
  // 목록
  const [totalElements, setTotalElements] = useState(0); // 총개수
  const [totalPages, setTotalPages] = useState(0); // 총페이지
  const [currentPage, setCurrentPage] = useState(0); // 현재페이지
  const [pageList, setPageList] = useState([]);
  const [prevPage, setPrevPage] = useState({});
  const [nextPage, setNextPage] = useState({});
  const [comment, setComment] = useState(null);
  const [param, setParam] = useState({
    page: 1,
    user_no: 3, // 임의의 값
    parent_no: Number(no),
  });
  const getCommentList = () => {
    axios
      .get("/api/comment/list", { params: param, headers: authHeader })
      .then((res) => {
        setComment(res.data.result.content);
        setTotalElements(res.data.result.totalElements);
        setTotalPages(res.data.result.totalPages);
        setCurrentPage(res.data.result.number + 1);
        setPageList(res.data.pageList);
        setPrevPage(res.data.prevPage);
        setNextPage(res.data.nextPage);
      });
  };
  useEffect(() => {
    getCommentList();
  }, []);

  // 댓글 등록
  const handleChange = (e) => {
    setParam({
      ...param,
      [e.target.name]: e.target.value,
    });
  };

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
            content: "",
          });
          getCommentList();
        }
      });
  };

  const save = () => {
    if (window.confirm("글을 등록하시겠습니까?")) {
      saveComment();
    }
  };

  const delComment = (no) => {
    let url = "/api/comment/delete?no=" + no;
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      axios.get(url, { headers: authHeader }).then((res) => {
        if (res.data.result === "success") {
          alert("정상적으로 삭제되었습니다.");
          getCommentList();
        }
      });
    }
  };

  const goEdit = (e) => {
    e.preventDefault();
    navigate("/board/edit?no=" + no);
  };
  const goReply = (e) => {
    e.preventDefault();
    navigate("/board/reply?no=" + no);
  };
  const goDelete = (e) => {
    if (window.confirm("삭제하시겠습니까?")) {
      axios
        .post("/api/reply/delete", { no: Number(no), headers: authHeader })
        .then((res) => {
          if (res.data.result === "success") {
            alert("정상적으로 삭제되었습니다.");
            navigate("/board/list");
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
                  <dt>{data && data.title}</dt>
                  <dd className="date">
                    작성일 : {data && data.writedate.substring(0, 10)}
                  </dd>
                </dl>
              </div>
              <div className="cont">
                <p
                  dangerouslySetInnerHTML={{ __html: data && data.content }}
                ></p>
              </div>
              <dl className="file">
                <dt>첨부파일 </dt>
                <dd>
                  {data && data.filename_org ? (
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

            <div>
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

              <p>
                <span>
                  <strong>총 {totalElements}개</strong> | {currentPage}/
                  {totalPages}
                </span>
              </p>
              <table className="list">
                <colgroup>
                  <col width="80px" />
                  <col width="*" />
                  <col width="100px" />
                  <col width="100px" />
                </colgroup>
                <tbody>
                  {comment ? (
                    comment.map((row, i) => (
                      <CommentTr row={row} key={i} delComment={delComment} />
                    ))
                  ) : (
                    <tr>
                      <td className="first" colSpan="4">
                        등록된 댓글이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="pagenate clear">
                <ul className="paging">
                  {prevPage !== null ? (
                    <li>
                      <Link
                        onClick={() =>
                          setParam({
                            ...param,
                            page: prevPage.pageNumber + 1,
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
                              e.pageNumber === currentPage - 1 ? "current" : ""
                            }
                            onClick={() =>
                              setParam({
                                ...param,
                                page: e.pageNumber + 1,
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
                            page: nextPage.pageNumber + 1,
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
