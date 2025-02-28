import { Link } from "react-router-dom"; // 라우팅 처리를 위한 컴포넌트

function CommentTr(props) {
  return (
    <>
      <tr>
        <td>{props.row.no}</td> {/* 댓글 번호 */}
        <td className="txt_l">
          {props.row.content} &nbsp;&nbsp;&nbsp; {/* 댓글 내용 */}
          {/* 삭제 버튼 */}
          <img
            className="delBtn"
            src="/img/ico_delete.png"
            alt=""
            onClick={() => props.delComment(props.row.no)} // 댓글 삭제 함수 호출
          />
        </td>
        <td className="writer">{props.row.user ? props.row.user.name : ""}</td>{" "}
        {/* 작성자 */}
        <td className="date">{props.row.writedate.substring(0, 10)}</td>{" "}
        {/* 작성일 */}
      </tr>
    </>
  );
}

export default CommentTr;
