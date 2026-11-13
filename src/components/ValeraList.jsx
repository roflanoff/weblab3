import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { valeraApi } from '../services/valeraApi'; 
import CreateValeraModal from './CreateValeraModal';

function ValeraList() {
  const [valeras, setValeras] = useState([]); 
  const [filteredValeras, setFilteredValeras] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  const loadValeras = async () => {
    try {
      setLoading(true); 
      setError(null); 
      const data = await valeraApi.getAllValeras(); 
      setValeras(data);
      setFilteredValeras(data);
    } catch (err) { 
      setError('Ошибка загрузки Валер: ' + err.message);
      console.error(err);
    } finally { 
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadValeras();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredValeras(valeras);
    } else {
      const filtered = valeras.filter((valera) =>
        valera.id.toString().includes(searchTerm)
      );
      setFilteredValeras(filtered);
    }
  }, [searchTerm, valeras]);

  // Создать нового Валеру
  const handleCreate = async () => {
    try {
      setLoading(true);
      await valeraApi.createValera();
      await loadValeras();
      setIsModalOpen(false); 
    } catch (err) {
      setError('Ошибка создания Валеры: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Удалить Валеру
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm(`Удалить Валеру #${id}?`)) { 
      try {
        await valeraApi.deleteValera(id);
        await loadValeras();
      } catch (err) {
        setError('Ошибка удаления: ' + err.message);
      }
    }
  };

  // Открыть детали
  const handleViewDetails = (id) => {
    navigate(`/valera/${id}`); 
  };

  const getHealthColor = (health) => {
    if (health > 70) return 'bg-green-500';
    if (health > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMoneyColor = (money) => {
    if (money > 500) return 'text-green-600';
    if (money > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

return (
  <div className="container mx-auto px-4 py-8">
    {/* Заголовок */}
    <div className="text-center mb-11">
      <h1 className="text-7xl font-bold text-white mb-1">
        🍺 Управление Валерами
      </h1>
    </div>

    {/* Панель управления */}
    <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
      <div className="flex flex-row gap-4 items-center justify-between">
        {/* Поиск */}
        <div className="w-64">
          <input
            type="text"
            placeholder="🔍 Поиск по ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Кнопка создания */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="w-auto bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➕ Создать Валеру
        </button>
      </div>
    </div>

    {/* Ошибки */}
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
        {error}
      </div>
    )}

    {/* Загрузка */}
    {loading && (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        <p className="text-white mt-4">Загрузка...</p>
      </div>
    )}

    {/* Список Валер */}
    {!loading && filteredValeras.length === 0 ? (
      <div className="bg-white rounded-lg shadow-xl p-12 text-center">
        <p className="text-gray-500 text-xl">
          {searchTerm ? '🔍 Ничего не найдено' : '📝 Нет Валер. Создайте первого!'}
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-6">
        {filteredValeras.map((valera) => (
          <div
            key={valera.id}
            onClick={() => handleViewDetails(valera.id)}
            className="bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            {/* Заголовок карточки */}
            <div className="bg-red-500 p-4">
              <h3 className="text-2xl font-bold text-white">
                Валера #{valera.id}
              </h3>
            </div>

            {/* Параметры */}
            <div className="p-6 space-y-4">
              {/* Здоровье */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">❤️ Здоровье</span>
                  <span className="text-sm font-bold text-gray-900">{valera.health}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${getHealthColor(valera.health)} h-3 rounded-full transition-all`}
                    style={{ width: `${valera.health}%` }}
                  ></div>
                </div>
              </div>

              {/* Алкоголь */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">🍺 Алкоголь</span>
                  <span className="text-sm font-bold text-gray-900">{valera.alcohol}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${valera.alcohol}%` }}
                  ></div>
                </div>
              </div>

              {/* Усталость */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">😴 Усталость</span>
                  <span className="text-sm font-bold text-gray-900">{valera.fatigue}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full transition-all"
                    style={{ width: `${valera.fatigue}%` }}
                  ></div>
                </div>
              </div>

              {/* Жизнерадостность */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">😊 Жизнерадостность</span>
                <span className={`text-lg font-bold ${valera.joy >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {valera.joy > 0 ? '+' : ''}{valera.joy}
                </span>
              </div>

              {/* Деньги */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">💰 Деньги</span>
                <span className={`text-xl font-bold ${getMoneyColor(valera.money)}`}>${valera.money}</span>
              </div>
            </div>

            {/* Кнопки */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between">
              <button
                onClick={() => handleViewDetails(valera.id)}
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                📊 Подробнее
              </button>
              <button
                onClick={(e) => handleDelete(valera.id, e)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
        <CreateValeraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
  </div>
);
}

export default ValeraList;
