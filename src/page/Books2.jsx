import React, { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, getDoc } from "firebase/firestore";

import { db } from '../database/firebase';
export default function FireStoreTest() {

    // 파이어스토어에서 가져온 값을 출력
    // const [users, setUsers] = useState();
    
    const [books, setBooks] = useState();

    const [title, setTitle] = useState();
    const [writer, setWriter] = useState();
    const [memo, setMemo] = useState();

    const [search, setSearch] = useState();
    const [searchBooks, setSearchBooks] = useState();

    // 수정될 값 state
    const [updateFirst, setUpdateFirst] = useState();

    // 검색할 last값
    const [searchLast, setSearchLast] = useState();

    // 검색된 user값
    const [searchUser, setSearchUser] = useState();

    // 유저id값이 문서의 id값일때, 문서의 값을 찾아올 수 있는지
    useEffect(() => {

        async function getUserData() {
            // doc()을 통해서 값을 찾을때, getDoc통해서 한 개의 값을 들고옴
            // const querySnapshot = await getDocs(doc(db,'userList','i3cAocvmIfVzLFRbsL85'));
            const querySnapshot = await getDoc(doc(db, 'userList', '1ehOCRUPNsGeOMUry9Uu'));
            // querySnapshot.forEach((doc)=>{
            //     console.log(doc.data)
            // })
            //바로 값을 들고오므로 forEach사용안함
            console.log(querySnapshot.data())
        }

        getUserData()
        // const querySnapshot = await getDocs(doc(db,'userList', 'aaa@aaa.aaa'));
        // querySnapshot.forEach((doc)=>{
        //     console.log(doc.data)
        // })
    }, [])


    //시작하자마자 값 가져오기
    useEffect(() => {
        getData();
    }, []);

    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()}`);
    // });

    // => 위 내용을 비동기함수로 수정해서 작성

    async function getData() {

        // getDocs를 통해서 컬렉션안의 모든 문서를 가져옴
        const querySnapshot = await getDocs(collection(db, "users"));

        // forEach에서 출력한 모든 값을 배열에 담음
        let dataArray = [];

        // forEach를 통해서 모든 문서값에 접근하여 원하는 값을 가져올 수 있음
        querySnapshot.forEach((doc) => {
            // doc.id와 doc.data()값을 리덕스/state에 저장하여 웹에서 사용
            // console.log(`${doc.id} => ${doc.data()}`);

            // setUsers(doc.data());
            //웹에서 사용 >> forEach의 모든 내용을 배열로 저장

            // id값을 함께 넣어주기위해서 새로운 객체 생성
            // id는 doc.id, 객체인 doc.data()는 ...를 통해서 그 안에 있는 값 꺼내서 사용
            // dataArray.push(doc.data());
            dataArray.push({
                id: doc.id,
                // 새로운 객체를 만들기위해
                ...doc.data()
            });

            console.log(`${doc.title}, ${doc.data().writer}`);
        });

        // 값이 들어간 배열을 state에 넣어서 활용
        // setUsers(dataArray);
        setBooks(dataArray);
    }

    // const addDocData=()=>{
    // 아래의 await는 비동기함수로만 사용가능
    // async 추가 작성
    const addDocData = async () => {
        try {
            // await는 비동기함수로만 사용가능
            const docRef = await addDoc(collection(db, "users"), {
                // first: "Ada",
                // last: "Lovelace",
                // born: 1815
                // first,
                // last,
                // born: parseInt(born)
                title,
                writer
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        // 버튼 클릭하면 출력이 됨
        getData();
    }

    // const deleteData = () => {
    const deleteData = async (id) => {
        // doc(db,컬렉션이름, id)로 하나의 문서를 찾을 수 있다
        // await deleteDoc(doc(db, "cities", "DC"));
        await deleteDoc(doc(db, "users", id));
        //화면에도 바로 적용되기위해 추가
        getData()
    }



    // id값을 가져와서 내용 업데이트
    // const updateData =()=>{
    const updateData = async (id) => {
        // await updateDoc(washingtonRef, {
        await updateDoc(doc(db, "users", id), {
            // capital: true
            first: updateFirst //setUpdateFirst내용이 들어갈 공간
        });
        // firebase에만 값이 변경되있기때문에 새로고침을 해주어야 값이 제대로 출력됨
        // getData()를 추가해주면 화면에 바로 출력
        getData()
    }


    // 검색하기버튼
    // 단일 쿼리를 이용하여 값 찾기
    const onSearch = async () => {
        //where 하나를 이용한 단일 쿼리
        //문자열에서 특정 문자열을 찾을 수 없다 noSQL
        //데이터를 세부적으로 사용 > 따로 서버를 만들어서 SQL 또는 noSQL을 사용
        // https://firebase.google.com/docs/firestore/query-data/queries?hl=ko&authuser=0#execute_a_query
        // const q = query(collection(db, "cities"), where("capital", "==", true));
        const q = query(collection(db, "users"),
            where("last", "==", searchLast),
            );

        // 작성한 쿼리 객체를 getDocs를 이용하여 가져옴
        const querySnapshot = await getDocs(q);

        // 배열을 사용해서 값 출력
        let dataArray = []

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            dataArray.push({
                id: doc.id,
                ...doc.data()
            })
        });

        setSearchUser(dataArray)
        // setSearchUser(dataArray)
    }


    return (
        <div>
            <h3>readingbooks 컬렉션</h3>

            <h2>책 추가</h2>


            <label htmlFor="">책이름</label>
            <input type="text" onChange={(e) => { setTitle(e.target.value) }} />

            <br />

            <label htmlFor="">작가 이름</label>
            <input type="text" onChange={(e) => { setWriter(e.target.value) }} />

            <br />

            <button onClick={addDocData}>추가</button>

            <hr />

            <input type="text" onChange={(e) => { setSearch(e.target.value) }} />
            <button onClick={onSearch}>읽은 책 검색하기</button>

            {/* 검색하기 */}
            {/* https://firebase.google.com/docs/firestore/query-data/queries?hl=ko&authuser=0#array_membership */}

            <hr />
            {
                //검색결과 출력
                searchUser && searchUser.map((user) => (
                    <div>{user.title}, {user.writer}</div>
                ))
            }

            <br />
            {
                books && books.map((user) => (
                    <div>
                        <span>{user.title}, {user.writer}</span>
                        <button onClick={() => { deleteData(user.id) }}>X</button>
                        <input type="text" onChange={(e) => { setUpdateFirst(e.target.value) }} />
                        <button onClick={() => { updateData(user.id) }}>First Edit</button>
                    </div>
                ))
            }

        </div>
    )
}
