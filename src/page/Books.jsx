import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    query,
    where,
    getDoc,
} from 'firebase/firestore';

import { db } from '../database/firebase';

export default function Books() {
    const [users, setUsers] = useState();
    const [title, setTitle] = useState();
    const [writer, setWriter] = useState();
    const [search, setSearch] = useState();
    const [searchBooks, setSearchBooks] = useState();

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const querySnapshot = await getDocs(collection(db, 'Books'));

        let dataArray = [];

        querySnapshot.forEach((doc) => {
            dataArray.push({
                id: doc.id,
                title: doc.data().title,
                writer: doc.data().writer,
                memo: doc.data().memo || '',
            });
        });

        setUsers(dataArray);
    }

    const addDocData = async () => {
        try {
            const docRef = await addDoc(collection(db, 'Books'), {
                title,
                writer,
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }

        getData();
    };

    const onSearch = async () => {
        const q = query(
            collection(db, 'Books'),
            where('title', '==', search)
        );

        const querySnapshot = await getDocs(q);

        let dataArray = [];

        querySnapshot.forEach((doc) => {
            dataArray.push({
                id: doc.id,
                title: doc.data().title,
                writer: doc.data().writer,
                memo: doc.data().memo || '',
            });
        });

        setSearchBooks(dataArray);
    };

    // const deleteMemo = async (memo) => {
    //     await deleteDoc(doc(db, 'Books', memo));
    //     getData();
    // };

    const deleteMemo = async (id) => {
        const bookRef = doc(db, 'Books', id);
        const bookDoc = await getDoc(bookRef);

        if (bookDoc.exists()) {
            await updateDoc(bookRef, {
                memo: ''
            });

            getData();
        }
    };




    const updateMemo = async (id, memo) => {
        await updateDoc(doc(db, 'Books', id), {
            memo: memo,
        });
        getData();
    };

    const promptMemo = (id) => {
        const memo = prompt('감상문을 작성해주세요');
        if (memo !== null) {
            updateMemo(id, memo);
        }
    };

    return (
        <div>
            <h3>readingbooks 컬렉션1</h3>
            <h2>책 추가</h2>

            <label htmlFor="">책이름</label>
            <input type="text" onChange={(e) => setTitle(e.target.value)} />
            <br />

            <label htmlFor="">작가 이름</label>
            <input type="text" onChange={(e) => setWriter(e.target.value)} />
            <br />

            <button onClick={addDocData}>추가</button>

            <hr />

            <input type="text" onChange={(e) => setSearch(e.target.value)} />
            <button onClick={onSearch}>읽은 책 검색하기</button>

            <hr />

            {searchBooks &&
                searchBooks.map((books) => (
                    <div key={books.id}>
                        {books.title}, {books.writer}
                        <br />
                        <button onClick={() => promptMemo(books.id)}>감상문 작성</button>
                        <br />
                        {books.memo ? (
                            <div>
                                <span>{books.memo}</span>
                                <button onClick={() => deleteMemo(books.id)}>X</button>
                            </div>
                        ) : null}


                    </div>
                ))}

        </div>
    );
}

