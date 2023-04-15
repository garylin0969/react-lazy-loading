import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface Card {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

function App() {
    const [cardList, setCardList] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchPhotos: () => Promise<void> = async () => {
            setIsLoading(true);
            await axios
                .get<Card[]>('https://jsonplaceholder.typicode.com/photos')
                .then((res) => {
                    setCardList((prev) => [...prev, ...res.data.slice(prev.length, prev.length + 50)]);
                })
                .catch((err) => console.log(err))
                .finally(() => setIsLoading(false));
        };

        // root: 用於指定元素的根節點，若設為 null 則表示使用瀏覽器視窗作為根節點。
        // rootMargin: 指定根節點的邊界，以像素為單位，這可以在觸發元素進入可視範圍之前預先增加一定的留白。
        // threshold: 指定觸發回調函數的閾值，即當目標元素進入可視範圍的比例超過閾值時，就會觸發回調函數。
        const options = {
            root: null, // 根元素
            rootMargin: '0px', // 預留空間
            threshold: 0.5, // 監聽閾值
        };

        const observer: IntersectionObserver = new IntersectionObserver((entries) => {
            // 創建一個監聽物件，並傳入一個回調函數，當被觀察的元素進入可視範圍時，便會觸發回調函數
            entries.forEach((entry) => {
                // 遍歷觀察的元素，並判斷是否進入可視範圍
                if (entry.isIntersecting) {
                    // isIntersecting 屬性，代表元素是否進入可視範圍
                    fetchPhotos();
                }
            });
        }, options);

        if (loaderRef.current) {
            // 當 loaderRef.current 為真時，說明 loaderRef 已經有元素被指定
            observer.observe(loaderRef.current); // 通過監聽物件的 observe 方法，對 loaderRef.current 元素進行觀察
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current); // 當組件銷毀時，使用監聽物件的 unobserve 方法，取消對 loaderRef.current 元素的觀察
            }
        };
    }, []);

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-6xl mx-auto py-4">
                {cardList.map((card) => (
                    <div
                        key={card.id}
                        className="cursor-pointer p-3 m-2 hover:shadow-slate-400 shadow-md rounded-lg border border-slate-400 transition-shadow duration-200 aspect-square"
                    >
                        <img src={card.url} alt={card.title} />
                        <p className="text-center text-2xl text-red-600">{card.id}</p>
                    </div>
                ))}
            </div>
            {isLoading && (
                <div className="text-center py-4">
                    <p className="text-gray-400">Loading...</p>
                </div>
            )}
            <div ref={loaderRef} className="text-center py-4">
                {!isLoading && <p className="text-gray-400">Scroll down to load more</p>}
            </div>
        </>
    );
}

export default App;
