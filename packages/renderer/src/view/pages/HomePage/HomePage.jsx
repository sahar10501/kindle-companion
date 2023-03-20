import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { BookInfoRepository, initVocabDb, getBooks } from '#preload';
import './HomePage.css';
import BookPreviewItem from '../../components/BookItem/BookItem';

function HomePage({ profile }) {
    // const userElements = profile.map((user, index) => (
    //     <div key={index}>
    //         <h2>{user.title}</h2>
    //     </div>
    // ));

    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                let repo = await getBooks()
                const result = await repo.findAll()
                console.log(result)
                const userElements = result.map((user, index) => (
                    <BookPreviewItem title={user.dataValues.title} />
                ));
                setData(userElements);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="home-page">
            <Sidebar />
            <div className="main-container">
                <div className="top-container">
                    <p>test</p>
                    <p>test</p>
                    <p>test</p>

                </div>
                <div className="catalog-wrapper">
                    <div className="catalog-container">
                        {data}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;