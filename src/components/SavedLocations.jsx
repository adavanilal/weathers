import React from 'react';
import {
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';

export default function SavedLocations({
  favorites,
  weather,
  newFavoriteInput,
  setNewFavoriteInput,
  handleAddFavoriteCustom,
  handleRemoveFavorite,
  handleSelectCity,
  setActiveNav,
  formatTemp,
  tempSymbol,
}) {
  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            Saved & Favorite Locations
          </h2>
          <p className="text-xs text-slate-400">Manage your pinned cities for quick monitoring</p>
        </div>

        {/* Add new place form */}
        <form onSubmit={handleAddFavoriteCustom} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newFavoriteInput}
            onChange={(e) => setNewFavoriteInput(e.target.value)}
            placeholder="Add city name..."
            className="px-3 py-1.5 bg-[#172b49] border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Grid of Saved Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav) => {
          const isActive = fav.name.toLowerCase() === weather.city.toLowerCase();
          return (
            <div
              key={fav.name}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-md ${
                isActive
                  ? 'bg-blue-600/20 border-blue-400/50 shadow-lg'
                  : 'bg-[#182c4b]/80 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{fav.name}</h3>
                  <span className="text-xs text-slate-400">{fav.country || 'Global'}</span>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(fav.name)}
                  title="Remove Location"
                  className="text-slate-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-white/5 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="my-4 flex items-center justify-between">
                <span className="text-3xl font-extrabold text-white">
                  {formatTemp(fav.temp)}{tempSymbol}
                </span>
                <span className="text-xs font-medium text-slate-300">
                  {fav.condition}
                </span>
              </div>

              <button
                onClick={() => {
                  handleSelectCity(fav);
                  setActiveNav('dashboard');
                }}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white cursor-default'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isActive ? 'Current Active City' : 'Set as Current City'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
