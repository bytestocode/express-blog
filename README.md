# 기본적인 기능의 블로그 만들기

## 와이어프레임
<img src="./img/framework.png" />

## API
### 1. 전체 게시글 목록 조회
#### Request
> method: GET   
> URL: /    

#### Response
> HTTP 상태코드: 200    
> payload: { posts }

### 2. 게시글 작성
#### Request
> method: GET/POST   
> URL: /newpost   
> body: { title, author, contents }

#### Response
> HTTP 상태코드: 200    
> payload: {}   

### 3. 게시글 조회
#### Request
> method: GET   
> URL: /posts/:id

#### Response
> HTTP 상태코드: 200    
> payload: { post }

### 4. 게시글 수정
#### Request
> method: GET/POST   
> URL: /posts/edit/:id   
> body: { title, author, contents }

#### Response
> HTTP 상태코드: 200    
> payload: { post }

### 5. 게시글 삭제
#### Request
> method: GET   
> URL: /posts/delete/:id

#### Response
> HTTP 상태코드: 200    
> payload: {}

### 6. 댓글 목록 조회
#### 게시글 데이터에 포함 

### 7. 댓글 작성
#### Request
> method: GET   
> URL: /posts/:id/newcomments   
> body: { author, contents } 

#### Response
> HTTP 상태코드: 200    
> payload: {}

### 8. 댓글 수정
#### Request
> method: GET/POST   
> URL: /posts/:id/:commentId/edit   
> body: { author, contents }

#### Response
> HTTP 상태코드: 200    
> payload: { post, comment }

### 9. 댓글 삭제
#### Request
> method: GET   
> URL: /posts/:id/:commentId/delete

#### Response
> HTTP 상태코드: 200    
> payload: {}

