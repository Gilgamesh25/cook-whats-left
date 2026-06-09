import { useState, useMemo, useEffect } from 'react'
import { recipesData } from './data/recipes.js'

const FRIDGE_CATEGORIES = {
  "🥩 Protein": ["ayam", "telur", "ayam suwir", "sapi", "udang", "ikan"],
  "🥦 Sayuran": ["kangkung", "paprika", "bawang bombay", "bawang putih", "bawang merah", "wortel", "brokoli", "kol", "sawi", "bayam", "cabe"],
  "🍚 Karbo": ["nasi", "kentang", "roti", "mie", "pasta"],
  "🧀 Dairy": ["keju", "mentega", "susu"],
  "🧂 Bumbu": ["kecap", "garam", "merica", "micin", "saos", "minyak", "air", "gula"],
  "🥗 Lain": ["tahu", "tempe"]
}

const CATEGORY_ICONS = {
  "🥩 Protein": "🥩",
  "🥦 Sayuran": "🥦",
  "🍚 Karbo": "🍚",
  "🧀 Dairy": "🧀",
  "🧂 Bumbu": "🧂",
  "🥗 Lain": "🥗"
}

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [tolerance, setTolerance] = useState(0)
  const [activeCategory, setActiveCategory] = useState("🥩 Protein")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    )
  }

  const matchedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return []
  
    return recipesData.map(recipe => {
      const missingIngredients = recipe.ingredients.filter(ing => 
        !selectedIngredients.includes(ing)
      )
      const missingCount = missingIngredients.length
      const isMatch = missingCount <= tolerance
      
      if (!isMatch) return null
  
      const matchCount = recipe.ingredients.length - missingCount
      const percentage = Math.round((matchCount / recipe.ingredients.length) * 100)
      
      return { ...recipe, matchCount, percentage, missingIngredients }
    }).filter(r => r !== null)
      .sort((a, b) => b.percentage - a.percentage)
  }, [selectedIngredients, tolerance])

  const getCategoryCount = (category) => {
    const items = FRIDGE_CATEGORIES[category]
    return items.filter(item => selectedIngredients.includes(item)).length
  }

  const getBadgeColor = (percentage) => {
    if (percentage >= 80) return "bg-emerald-500 text-white"
    if (percentage >= 60) return "bg-orange-400 text-white"
    return "bg-gray-400 text-white"
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-emerald-100 font-sans">
      {/* HEADER */}
      <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-emerald-100/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍳</span>
            <div>
              <h1 className="text-xl font-bold text-emerald-600">
                CookWhat'sLeft
              </h1>
              <p className="text-xs text-gray-400">Masak apa hari ini?</p>
            </div>
          </div>
          <div className="text-2xl">三点三</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        
        {/* HERO */}
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Yuk, Masak Apa Hari Ini? 🧑‍🍳
            </h2>
            <p className="text-gray-500 text-sm">
              Pilih bahan yang ada di kulkas, nanti kita cariin resepnya!
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {Object.keys(FRIDGE_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${activeCategory === cat 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-300 scale-105' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200'
                  }
                `}
              >
                <span className="mr-1">{CATEGORY_ICONS[cat]}</span>
                {cat}
                {getCategoryCount(cat) > 0 && (
                  <span className="ml-1.5 bg-emerald-100 text-emerald-600 text-xs px-1.5 py-0.5 rounded-full">
                    {getCategoryCount(cat)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Fridge Grid */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl shadow-emerald-100/50 border border-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{CATEGORY_ICONS[activeCategory]}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {activeCategory}
              </span>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {FRIDGE_CATEGORIES[activeCategory].map((item) => {
                const isActive = selectedIngredients.includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggleIngredient(item)}
                    className={`
                      py-3 px-2 rounded-xl text-sm font-medium capitalize 
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-300 scale-110' 
                        : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                      }
                    `}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
            
            {/* Selected Summary */}
            {selectedIngredients.length > 0 && (
              <div className="mt-5 pt-4 border-t border-dashed border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">
                    ✨ {selectedIngredients.length} bahan dipilih
                  </p>
                  <button 
                    onClick={() => setSelectedIngredients([])}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    🗑️ Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map((ing) => (
                    <span 
                      key={ing} 
                      className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-2"
                    >
                      {ing}
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleIngredient(ing); }}
                        className="w-4 h-4 flex items-center justify-center rounded-full bg-emerald-200 hover:bg-red-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <button 
                disabled={selectedIngredients.length === 0}
                onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                className={`
                  px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300
                  flex items-center gap-2
                  ${selectedIngredients.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:shadow-xl hover:shadow-emerald-300 hover:scale-105'
                  }
                `}
              >
                <span className="text-xl">🍳</span>
                Masak Sekarang!
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <section id="results">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-emerald-700">
              🍽️ Rekomendasi Resep
            </h2>
            
            {selectedIngredients.length > 0 && (
              <select 
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="text-sm bg-white px-3 py-1.5 rounded-full border border-emerald-200"
              >
                <option value={0}>100% match</option>
                <option value={1}>-1 bahan</option>
                <option value={2}>-2 bahan</option>
              </select>
            )}
          </div>
          
          {matchedRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-2xl border-2 border-dashed border-emerald-200">
              <div className="text-4xl mb-3">🥬</div>
              <p className="text-gray-400">
                {selectedIngredients.length === 0 
                  ? "Pilih bahan di atas untuk mulai cooking!"
                  : "Ga ada resep yang cocok 😅"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matchedRecipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  onClick={() => setShowModal(recipe)}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:shadow-emerald-100 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`
                    absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold
                    ${getBadgeColor(recipe.percentage)}
                  `}>
                    {recipe.percentage}%
                  </div>

                  <div className="relative h-36 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 group-hover:text-emerald-600">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>⏱️ {recipe.time}</span>
                      <span>🥗 {recipe.ingredients.length} bahan</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 4).map(ing => (
                        <span key={ing} className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg text-gray-500">
                          {ing}
                        </span>
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <span className="text-[10px] text-gray-400">+{recipe.ingredients.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(null)}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="relative h-44">
              <img 
                src={showModal.image} 
                alt={showModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <button 
                onClick={() => setShowModal(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white">{showModal.title}</h3>
                <p className="text-white/80 text-sm">⏱️ {showModal.time}</p>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Bahan yang diperlukan
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {showModal.ingredients.map((ing, idx) => {
                    const hasIt = selectedIngredients.includes(ing)
                    return (
                      <div 
                        key={idx} 
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                          ${hasIt ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'}
                        `}
                      >
                        <span className={`w-2 h-2 rounded-full ${hasIt ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        {ing}
                        {!hasIt && <span className="text-xs">(butuh)</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Langkah Memasak
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {showModal.instructions}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App