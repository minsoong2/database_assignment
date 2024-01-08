const express = require('express');

const mysql = require('mysql');
// MariaDB 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '20193060',
  database: 'mariadb'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB:', err);
    return;
  }
  console.log('Connected to MariaDB');
});


const app = express();
const port = 3000;
// POST 요청의 본문(body)을 파싱
const bodyParser = require('body-parser');
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
// URL 인코딩된 요청 본문을 파싱
app.use(express.urlencoded({ extended: false }));


// 라우팅 설정
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/20193060_web.html');
});

// 서버 시작
app.listen(port, () => {
  console.log(`웹 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

// 게시글 작성
app.post('/submit_post', (req, res) => {
  const { author, title, content } = req.body;
  const date = new Date().toISOString().split('T')[0]; // 현재 날짜

  const insertQuery = 'INSERT INTO posts (author, title, content, date) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [author, title, content, date], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving post');
    } else {
      const postId = result.insertId; // 자동으로 생성된 고유번호(ID)
      // 게시글 작성 후 새로고침하여 게시글 목록에 추가되도록 리다이렉트 처리
      res.redirect(req.headers.referer);
    }
  });
});

// 게시글 목록 조회
app.get('/submit_post', (req, res) => {
  const selectQuery = 'SELECT * FROM posts ORDER BY id ASC';
  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving posts');
    } else {
      res.status(200).json(result);
    }
  });
});

// 게시글 상세 조회
app.get('/post/:postId', (req, res) => {
  
  const postId = req.params.postId;

  // 게시글 상세 정보 쿼리
  const postQuery = `SELECT * FROM posts WHERE id = ${postId}`;

  // 댓글 정보 쿼리
  const commentsQuery = `SELECT * FROM comments WHERE postId = ${postId}`;

  // 게시글 정보 조회
  db.query(postQuery, (error, postResult) => {
    if (error) {
      console.error('게시글 조회 실패:', error);
      res.status(500).json({ error: '게시글 조회에 실패했습니다.' });
    } else {
      const post = postResult[0];

      if (!post) {
        res.status(404).send('Post not found');
      } else {
        const { id, title, author, content } = post;

        // 게시글 작성일자
        const postDate = new Date(post.date);
        const formattedPostDate = postDate.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        // 댓글 정보 조회
        db.query(commentsQuery, (error, commentsResult) => {
          if (error) {
            console.error('댓글 조회 실패:', error);
            res.status(500).json({ error: '댓글 조회에 실패했습니다.' });
          } else {
            const comments = commentsResult;

            let html = `
              <h2>게시글 상세 조회 <button id="closeButton" onclick="closePostDetail()">닫기</button> </h2>
              <p>고유번호: ${id}</p>
              <p>제목: ${title}</p>
              <p>작성자: ${author}</p>
              <p>작성일자: ${formattedPostDate}</p>
              <p>내용:</p>
              <p>${content}</p>
              <h3>댓글</h3>
            `;

            for (let comment of comments) {
              const { id, author, content, date } = comment;
              const commentDate = new Date(date);
              const formattedCommentDate = commentDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              html += `
                <ui>
                  <p>작성자: ${author}</p>
                  <p>댓글 내용: ${content}</p>
                  <p>작성일자: ${formattedCommentDate}</p>
                  <button onclick="handleDeleteComment(event)" data-comment-id="${id}">삭제</button>
                </ui>
              `;
            }

            html += '</ul>';

            res.status(200).send(html);
          }
        });
      }
    }
  });

});

// 댓글 삭제
app.delete('/comment/:commentId', (req, res) => {
  const commentId = req.params.commentId;

  // 댓글 삭제 쿼리
  const deleteQuery = `DELETE FROM comments WHERE id = ${commentId}`;

  db.query(deleteQuery, (error, result) => {
    if (error) {
      console.error('댓글 삭제 실패:', error);
      res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
    } else {
      console.log('댓글 삭제 성공:', commentId);
      res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    }
  });
});

// 댓글 작성
app.post('/submit_comment', (req, res) => {
  const { postTitle, author, content } = req.body;

  // 게시글 제목으로 해당 게시글 ID 조회
  const postIdQuery = `SELECT id FROM posts WHERE title = '${postTitle}'`;

  db.query(postIdQuery, (error, results) => {
    if (error) {
      console.error('게시글 ID 조회 실패:', error);
      res.status(500).json({ error: '게시글 ID 조회에 실패했습니다.' });
    } else {
      const postId = results[0].id;

      // 댓글 작성일시
      const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // 댓글 데이터 삽입 쿼리
      const insertCommentQuery = `
        INSERT INTO comments (postId, author, content, date)
        VALUES (${postId}, '${author}', '${content}', '${date}')
      `;

      db.query(insertCommentQuery, (error, results) => {
        if (error) {
          console.error('댓글 작성 실패:', error);
          res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
        } else {
          const commentId = results.insertId;
          console.log('댓글 작성 성공:', commentId);
          res.status(200).json({ commentId });
        }
      });
    }
  });
});

// 게시글 삭제 (+ 댓글 삭제)
app.delete('/post/:postId', (req, res) => {
  const postId = req.params.postId;

  // 게시글 삭제 쿼리
  const deletePostQuery = `DELETE FROM posts WHERE id = ${postId}`;

  // 댓글 삭제 쿼리
  const deleteCommentsQuery = `DELETE FROM comments WHERE postId = ${postId}`;


  // 관련된 댓글 삭제
  db.query(deleteCommentsQuery, (error, result) => {
    if (error) {
      console.error('댓글 삭제 실패:', error);
      res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
    } else {
      console.log('게시글에 연관된 댓글 삭제 성공:', postId);
      res.status(200).json({ message: '게시글과 댓글이 성공적으로 삭제되었습니다.' });
      
      // 관련된 댓글 삭제후 게시글 삭제
      db.query(deletePostQuery, (error, result) => {
        if (error) {
          console.error('게시글 삭제 실패:', error);
          res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
        } else {
          console.log('게시글 삭제 성공:', postId);
        }
      });
    }
  });
});
