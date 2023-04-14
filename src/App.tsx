import { useEffect, useRef, useState } from 'react';

function App() {
    const [cardList, setCardList] = useState<number[]>(new Array(25).fill(0).map((value, index) => index + 1));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const options = {
            root: null, // 根元素
            rootMargin: '0px', // 預留空間
            threshold: 0.5, // 監聽閾值
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsLoading(true); // 設定為正在加載中
                    setTimeout(() => {
                        setCardList((prev) => [
                            ...prev,
                            ...new Array(25).fill(0).map((value, index) => prev.length + index + 1),
                        ]);
                        setIsLoading(false); // 設定為加載結束
                    }, 1500); // 延遲3秒後再觸發回調函數
                }
            });
        }, options);

        // loaderRef.current 有值的話，就觀察 loaderRef.current 的元素
    if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        // return 一個無名函式，在元件卸載時，如果 loaderRef.current 有值的話，就取消觀察 loaderRef.current 的元素
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, []);

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-6xl mx-auto py-4">
                {cardList.map((value, index) => {
                    return (
                        <div
                            key={index}
                            className="cursor-pointer p-3 m-2 hover:shadow-slate-400 shadow-md rounded-lg border border-slate-400 transition-shadow duration-200 aspect-square flex justify-center items-center"
                        >
                            <h3 className="text-3xl text-rose-600">{value}</h3>
                        </div>
                    );
                })}
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
