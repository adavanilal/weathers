import React from 'react';
import {
  Search,
  X,
  Crosshair,
  Bell,
  MapPin,
  History,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export default function Header({
  cityInput,
  setCityInput,
  handleSearchSubmit,
  handleSearchKeyDown,
  searchFocused,
  setSearchFocused,
  searchSuggestionIndex,
  setSearchSuggestionIndex,
  filteredSuggestions,
  handleSelectSuggestion,
  recentSearches,
  removeRecentSearch,
  clearRecentSearches,
  searchContainerRef,
  unit,
  setUnit,
  handleLocateMe,
  locating,
  notifications,
  unreadCount,
  showNotifications,
  setShowNotifications,
  markAllNotificationsAsRead,
  clearAllNotifications,
  showProfileModal,
  setShowProfileModal,
  favoritesCount,
  setActiveNav,
  onOpenLogout,
  formatTemp,
  tempSymbol,
  triggerToast,
}) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-30">
      {/* Search Input with Auto-Suggestions & History */}
      <div ref={searchContainerRef} className="w-full sm:max-w-md relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={cityInput}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setCityInput(e.target.value);
              setSearchFocused(true);
              setSearchSuggestionIndex(-1);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search city (e.g. Mumbai, Tokyo, London)..."
            className="w-full pl-11 pr-10 py-2.5 bg-[#172b49]/70 border border-white/10 rounded-xl text-sm placeholder-slate-400 text-white focus:outline-none focus:border-blue-400/60 focus:bg-[#1a3254]/90 transition shadow-inner"
          />
          <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          {cityInput && (
            <button
              type="button"
              onClick={() => {
                setCityInput('');
                setSearchSuggestionIndex(-1);
              }}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Suggestions Dropdown */}
        {searchFocused && (
          <div className="absolute left-0 right-0 mt-2 bg-[#0f213a]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden text-xs divide-y divide-white/5 animate-fade-in">
            {cityInput.trim().length > 0 ? (
              // Matching Suggestions when typing
              <div className="p-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center justify-between">
                  <span>Matching Cities</span>
                  <span>{filteredSuggestions.length} found</span>
                </div>

                {filteredSuggestions.length > 0 ? (
                  <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                    {filteredSuggestions.map((city, idx) => {
                      const isHighlighted = searchSuggestionIndex === idx;
                      return (
                        <button
                          key={city.name + city.country}
                          type="button"
                          onClick={() => handleSelectSuggestion(city)}
                          onMouseEnter={() => setSearchSuggestionIndex(idx)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                            isHighlighted
                              ? 'bg-blue-600/35 border border-blue-400/40 text-white'
                              : 'hover:bg-white/5 border border-transparent text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="p-1 rounded-lg bg-white/5 text-sky-300">
                              <MapPin className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <span className="font-semibold text-white">{city.name}</span>
                              <span className="text-[11px] text-slate-400 ml-1.5">
                                {city.state ? `${city.state}, ` : ''}{city.country}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-sky-200 font-mono font-bold">
                              {city.code}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {formatTemp(city.temp)}{tempSymbol}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 px-3 text-center">
                    <p className="text-xs text-slate-300">
                      No predefined match for "<span className="text-sky-300">{cityInput}</span>"
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
                    >
                      <Search className="w-3 h-3" />
                      <span>Search global weather for "{cityInput}"</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Default State: Recent Searches + Popular/Trending Cities
              <div className="p-3 flex flex-col gap-3">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-sky-400" />
                        Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[10px] text-slate-400 hover:text-red-300 transition"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-xs text-slate-200 transition group"
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(term)}
                            className="hover:text-sky-300 text-left"
                          >
                            {term}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(term);
                            }}
                            className="text-slate-400 hover:text-red-300 p-0.5 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending & Popular Cities */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Popular Indian & Global Hubs</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {['Hyderabad', 'Delhi', 'Mumbai', 'Bengaluru', 'London', 'Tokyo', 'New York', 'Dubai'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleSelectSuggestion(c)}
                        className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-blue-600/30 border border-white/5 hover:border-blue-400/30 text-left text-xs font-medium text-slate-200 hover:text-white transition flex items-center justify-between"
                      >
                        <span>{c}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-3.5 self-end sm:self-auto relative">
        {/* Unit Quick Toggle Button (°C / °F) */}
        <button
          onClick={() => {
            const nextUnit = unit === 'C' ? 'F' : 'C';
            setUnit(nextUnit);
            triggerToast(`Switched to °${nextUnit}`);
          }}
          title="Toggle Temperature Unit"
          className="px-3 py-2 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-xs font-bold text-sky-200 transition flex items-center gap-1 shadow-md"
        >
          <span>°{unit}</span>
          <span className="text-[10px] text-slate-400 font-normal">switch</span>
        </button>

        {/* GPS Locate Me Button */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          title="Detect GPS Current Location"
          className={`p-2.5 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-slate-300 hover:text-white transition ${
            locating ? 'animate-spin text-sky-400' : ''
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Notification Bell Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Weather Alerts"
            className="relative p-2.5 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-slate-300 hover:text-white transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#12233c]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-[#101e33] border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Weather Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No active alerts right now.</p>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition ${
                        n.unread
                          ? 'bg-sky-500/10 border-sky-400/30'
                          : 'bg-white/5 border-white/5 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-200">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[11px]">
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-sky-300 hover:text-sky-100 font-medium"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="text-red-300 hover:text-red-200 font-medium"
                >
                  Clear alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Button */}
        <div className="relative">
          <button
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 shadow-md hover:ring-2 hover:ring-blue-400/50 transition cursor-pointer"
            title="Profile & Preferences"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Profile Popup */}
          {showProfileModal && (
            <div className="absolute right-0 mt-3 w-64 bg-[#101e33] border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl z-50">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Amit Lal</h4>
                  <p className="text-[11px] text-slate-400">Personal Station</p>
                </div>
              </div>

              <div className="py-2.5 flex flex-col gap-1.5 text-xs">
                <button
                  onClick={() => {
                    setActiveNav('locations');
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200"
                >
                  <span>Saved Locations</span>
                  <span className="text-[10px] bg-blue-500/30 px-2 py-0.5 rounded-full text-blue-200">
                    {favoritesCount}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveNav('settings');
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200"
                >
                  <span>Preferences</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <button
                onClick={() => {
                  setShowProfileModal(false);
                  onOpenLogout();
                }}
                className="w-full mt-2 pt-2 border-t border-white/10 text-left text-xs text-red-300 hover:text-red-200 p-2 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
