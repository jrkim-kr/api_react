/*
게시글 행을 표시하는 컴포넌트
*/

import { Link } from "react-router-dom"; // 라우팅 처리를 위한 컴포넌트

function BoardTr(props) {
  let url = "/board/view?no=" + props.row.no; // 게시글 상세 페이지 URL
  let nested = ""; // 들여쓰기를 위한 공백

  // 답변 단계에 따른 들여쓰기 공백 생성
  for (let i = 0; i < props.row.nested; i++) {
    nested += "&nbsp;&nbsp;&nbsp;&nbsp;"; // 들여쓰기 공백 추가
  }

  // 답변글인 경우 아이콘 추가
  if (props.row.nested > 0)
    nested += "<img src='/img/ico_re.png' alt=''/>&nbsp;&nbsp;";

  return (
    <>
      <tr>
        <td>{props.row.no}</td> {/* 게시글 번호 */}
        <td className="txt_l">
          <Link to={url}>
            {/* dangerouslySetInnerHTML을 사용하여 HTML 코드 렌더링 (들여쓰기와 아이콘) */}
            <span dangerouslySetInnerHTML={{ __html: nested }}></span>
            {props.row.title} [{props.row.comment.length}]{" "}
            {/* 제목과 댓글 수 */}
          </Link>
        </td>
        <td>{props.row.viewcnt}</td> {/* 조회수 */}
        <td className="writer">
          {props.row.user ? props.row.user.name : ""}
        </td>{" "}
        {/* 작성자 */}
        <td className="date">{props.row.writedate.substring(0, 10)}</td>{" "}
        {/* 작성일 (YYYY-MM-DD 형식) */}
      </tr>
    </>
  );
}

export default BoardTr;
