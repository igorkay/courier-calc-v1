import React, { useState, useEffect } from 'react';

function App() {
    // Загрузка данных (включая историю)
    const [totalEarnings, setTotalEarnings] = useState(() => JSON.parse(localStorage.getItem('earnings')) || 0);
    const [totalTips, setTotalTips] = useState(() => JSON.parse(localStorage.getItem('tips')) || 0);
    const [km, setKm] = useState(() => JSON.parse(localStorage.getItem('km')) || 0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
    
    const [currentRate, setCurrentRate] = useState("");
    const [currentTip, setCurrentTip] = useState(0);

    // Сохранение всех данных в память
    useEffect(() => {
        localStorage.setItem('earnings', JSON.stringify(totalEarnings));
        localStorage.setItem('tips', JSON.stringify(totalTips));
        localStorage.setItem('km', JSON.stringify(km));
        localStorage.setItem('history', JSON.stringify(history));
    }, [totalEarnings, totalTips, km, history]);

    const fullTotal = totalEarnings + totalTips;
    const earningsPerKm = km > 0 ? (fullTotal / km).toFixed(2) : 0;

    const addDelivery = () => {
        if (currentRate === 0 && currentTip === 0) return;
        
        const sum = currentRate + currentTip;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Добавляем новый заказ в начало списка истории
        const newEntry = { sum, time, id: Date.now() };
        setHistory(prev => [newEntry, ...prev].slice(0, 5)); // Храним только последние 5

        setTotalEarnings(prev => prev + currentRate);
        setTotalTips(prev => prev + currentTip);
        setCurrentRate(0);
        setCurrentTip(0);
    };

    const resetShift = () => {
        if(window.confirm("Обнулить смену и историю?")) {
            setTotalEarnings(0);
            setTotalTips(0);
            setKm(0);
            setHistory([]);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Моя Смена 🚲</h2>
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Ставка:</label>
                        <input 
                            type="number" 
                            value={currentRate === 0 ? '' : currentRate} 
                            onChange={e => setCurrentRate(e.target.value === '' ? 0 : Number(e.target.value))} 
                            placeholder="0"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Чай:</label>
                        <input 
                            type="number" 
                            value={currentTip === 0 ? '' : currentTip} 
                            onChange={e => setCurrentTip(e.target.value === '' ? 0 : Number(e.target.value))} 
                            placeholder="0"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }} 
                        />
                    </div>
                </div>

                <button onClick={addDelivery} style={{ width: '100%', padding: '18px', background: '#28a745', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>
                    ✅ Завершить: {currentRate + currentTip} ₽
                </button>

                {/* Статистика */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ background: '#f0f7ff', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#0056b3' }}>ИТОГО</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{fullTotal} ₽</div>
                    </div>
                    <div style={{ background: '#fff0f0', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#c82333' }}>ЗА 1 КМ</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{earningsPerKm} ₽</div>
                    </div>
                </div>

                {/* Пробег */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '10px' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>Общий путь:</span>
        <span style={{ fontSize: '18px' }}><strong>{km} км</strong></span>
    </div>
    <div style={{ display: 'flex', gap: '5px' }}>
        {/* Кнопка минус (работает только если пробег больше 0) */}
        <button 
            onClick={() => setKm(prev => Math.max(0, prev - 1))} 
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ffcfcf', color: '#d93025', cursor: 'pointer', background: '#fff' }}
            title="Убрать лишний км"
        >
            -1
        </button>
        <button 
            onClick={() => setKm(km + 1)} 
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', background: '#fff' }}
        >
            +1
        </button>
        <button 
            onClick={() => setKm(km + 5)} 
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', background: '#fff' }}
        >
            +5
        </button>
    </div>
</div>
                {/* История последних заказов */}
                {history.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', textAlign: 'center' }}>ПОСЛЕДНИЕ ЗАКАЗЫ:</div>
                        {history.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fcfcfc', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                                <span style={{ color: '#666' }}>{item.time}</span>
                                <span style={{ fontWeight: 'bold' }}>+{item.sum} ₽</span>
                            </div>
                        ))}
                    </div>
                )}
                
                <button onClick={resetShift} style={{ width: '100%', marginTop: '25px', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>
                    Сбросить всё
                </button>
            </div>
        </div>
    );
}

export default App;