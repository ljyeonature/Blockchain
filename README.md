## React Truffle Metamask

## (위에 있는 코드들 zip 파일로 다운 받지 말고 새로 만들기!! - 코드만 복사해서 붙여넣기)

## 00. 메타마스크(여우) - (크롬 추천) 설치 - 검색 & 참조해서 설치 + 가나슈(ganache) 네트워크 추가 + 가나슈 계정 가져오기
- 설치
https://happysara0512.com/entry/%EB%A9%94%ED%83%80%EB%A7%88%EC%8A%A4%ED%81%ACMetaMask-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0-bsc-matic-%EC%B6%94%EA%B0%80%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-%EC%9B%90%ED%95%98%EB%8A%94-%ED%86%A0%ED%81%B0-%EC%B6%94%EA%B0%80%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95
- 네트워크 추가
https://digiconfactory.tistory.com/entry/python-blockchain-ganache-metaMask
- 계정 가져오기
https://about-tech.tistory.com/208

## 0. 터미널로 가서 react app 만들기
```sh
# 프로젝트 앱을 만들고 싶은 곳으로 가기
$ create-react-app 프로젝트이름
```
- 성공 시
- 마지막에 Happy Hacking 뜨면 성공.
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/4ba8dfe6-8d26-40c9-bb23-f07fe8b6dab5)


## 1. truffle 설치
```sh
# 만든 프로젝트 vscode로 들어가기
# vscode 메뉴 중 Terminal > new Terminal
$ npm install -g truffle
$ truffle init
```
- 성공 시
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/32f77ca7-25e6-4fb2-ac23-64beff96f92e)

- 디렉토리 사진
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/dd832da3-a709-4c16-8a07-8c9ae4695b9f)


## 2. truffle-config.js 파일 고치기
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/478d110c-e3c8-44c1-b207-c3a2df313299)
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/aaad51cc-fbfd-4dea-8a4d-fdfbb4782517)
- 위 사진처럼 작성! 주석 부분으로 처리 되어있으니깐 주석 없애고 내용만 고치면 끝!


## 3. 스마트 컨트랙트 코드 작성하기 - contracts & migrations
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/3c6a280a-b583-4961-89fc-198548d6bf9b)
- 코드는 위에 경로로 들어가서 코드 복사/붙여넣기
- contracts > Donation.sol(새로 만들고 내용 채우기)
- migrations > 1_deploy_donation.js(새로 만들고 내용 채우기)

## 4. truffle compile / migrate 하기
```sh
# vscode에서 터미널에 들어가서 truffle 폴더로 이동
$ cd truffle
$ truffle compile
$ truffle migrate
```
- truffle compile 성공 시
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/7ce5dae6-b894-4276-a274-7feea86e5aeb)

- truffle migrate 성공 시
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/c29fa6df-0051-4092-8cab-0d0b053c61ef)


## 5.1. App.js에 코드 붙여넣기
## 5.2 .env 파일 추가하고 코드 내용 복사하기
## 5.3. src에 contracts폴더 생성하기 : src > contracts/Donation.json
- truffle compile를 성공하면, build/contracts/Donation.json 파일이 생길 것이다.
- 여기의 Donation.json 파일을 복사해 생성한 contracts 폴더에 넣는다.(경로 때문에..)

- 디렉토리 최종 상태
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/8112ce93-517b-48d5-9302-064f90df8cd0)

## 6. 실행하기
```sh
# vscode에서 터미널에 들어가서
# 먼저 web3과 web-react 설치
$ npm install web3
$ npm install web3-react
$ npm start
```
- 성공 시
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/b33b52ad-04f3-4bfe-bd7a-ce39bc8bdb2c)

## 7. 웹 화면
- 이 화면이 나오면 된다.
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/c7d87742-2528-4d9e-a52c-f63f71c6abff)
Connetec Account가 Ganache에서 연결한 계정인지 보면 확인!
![image](https://github.com/ljyeonature/Blockchain/assets/100672796/9dca860c-58c2-4035-aebc-49f62fda993f)




