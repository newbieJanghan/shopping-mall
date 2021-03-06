# Elice SW 2기 웹 개발 프로젝트 - 쇼핑몰 웰 클론 코딩

<br />

## 1. 서비스 링크

https://shoppingmall-clonecoding.herokuapp.com/

<br />

## 2. 서비스 소개

### 팀 프로젝트 - 제품 등록, 장바구니 추가, 주문하기 등 쇼핑몰의 핵심 서비스를 구현합니다. 
1. 회원가입, 로그인, 회원정보 수정 및 탈퇴 등 사용자 관련 CRUD를 할 수 있습니다.
2. 카테고리 관련 CRUD, 제품 관련 CRUD, 주문 관련 CRUD할 할 수 있습니다.
3. 장바구니 관련 기능을 프론트 단에서 수행할 수 있습니다.  
4. 관리자 페이지가 있습니다.

### 개인 프로젝트 - 기능, 성능 개선
1. 검색 엔진 없이 최대한으로 검색 기능 활성화
 - 삽질 일기: https://thoughthrough.tistory.com/36
 - 구현 과정
   <br>
   ** 가장 적절한 검색 결과가 먼저 보일 수 있도록 정렬하기 (by $text, $search, $meta, textScore, $sort)
   <br>
   ** 검색어를 포함한 텍스트를 찾기 (by $match, $regex)
   <br>
   ** $text vs $regex 중 하나를 선택해야하는 기능적 한계를 극복하고자 노력함
   <br>

2. 사이즈, 검색어 field 추가 및 프론트 페이지 구현
  - 구현 과정
    <br>
    ** 재고를 유연하게 추가할 수 있는 동적 버튼과 field 값을 object로 설정
    <br>
    ** object 객체를 request.body에 담을 수 있도록 urlencoded 설정 변경 및 qs 라이브러리 사용
    <br>
    ** 검색어에 #을 달아 추가할 수 있도록 구현하고 field 값을 arry로 설정
    
3. 상위 4개 상품을 추리는 코드의 위치 변경 (진행 중)

<br />

## 3. API 문서

(swagger 준비 중)

<br />
