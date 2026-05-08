import { useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from './services/storageService';
import { seedRecipes } from './data/seedRecipes';
import Sidebar from './components/Sidebar';
import IndexPanel from './components/IndexPanel';
import Topbar from './components/Topbar';
import HomeView from './components/views/HomeView';
import SavedView from './components/views/SavedView';
import DetailView from './components/views/DetailView';
import EditView from './components/views/EditView';
import UploadView from './components/views/UploadView';
import CalendarView from './components/views/CalendarView';
import SettingsView from './components/views/SettingsView';
import Modal from './components/Modal';
import Toast from './components/Toast';

const INDEX_PAGES = ['home', 'saved', 'favorites'];

function blankRecipe() {
  return {
    id: 'new_' + Date.now(),
    n: '', e: '🍽️', tags: [], time: '', prep: '',
    diff: 'Easy', srv: 2, fav: false, ts: Date.now(),
    src: 'Manual', ing: [], steps: [], notes: '',
    c1: '#e8d5b0', c2: '#c8dbc9',
  };
}

export default function App() {
  const [page, setPage] = useState('home');
  const [recipes, setRecipes] = useState([]);
  const [calendar, setCalendar] = useState({});
  const [settings, setSettings] = useState({
    accent: '#b5863a',
    florals: true,
    compact: false,
    settingsTab: 'appearance',
  });
  const [detailId, setDetailId] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [calDate, setCalDate] = useState(new Date());

  // ── LOAD ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const data = loadData();
    if (data && Array.isArray(data.recipes) && data.recipes.length > 0) {
      setRecipes(data.recipes);
      setCalendar(data.calendar || {});
      if (data.settings) setSettings(s => ({ ...s, ...data.settings }));
    } else {
      setRecipes([...seedRecipes]);
    }
  }, []);

  // ── SAVE ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (recipes.length > 0) {
      saveData({ recipes, calendar, settings });
    }
  }, [recipes, calendar, settings]);

  // ── ACCENT COLOR ────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty('--gold', settings.accent);
  }, [settings.accent]);

  // ── HELPERS ─────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const navigate = useCallback((pg, opts = {}) => {
    setPage(pg);
    if (opts.detailId !== undefined) setDetailId(opts.detailId);
    if (opts.editRecipe !== undefined) setEditRecipe(opts.editRecipe);
  }, []);

  const toggleFav = useCallback((id) => {
    setRecipes(rs => rs.map(r => r.id === id ? { ...r, fav: !r.fav } : r));
  }, []);

  const saveRecipe = useCallback((recipe) => {
    setRecipes(rs => {
      const idx = rs.findIndex(r => r.id === recipe.id);
      if (idx >= 0) {
        const updated = [...rs];
        updated[idx] = recipe;
        return updated;
      }
      return [recipe, ...rs];
    });
  }, []);

  const deleteRecipe = useCallback((id) => {
    setRecipes(rs => rs.filter(r => r.id !== id));
    showToast('Recipe deleted');
    navigate('saved');
  }, [navigate, showToast]);

  const addToCalendar = useCallback((dateKey, recipeId, mealType = 'Dinner') => {
    setCalendar(cal => {
      const existing = cal[dateKey] || [];
      if (existing.find(m => m.id === recipeId)) return cal;
      return { ...cal, [dateKey]: [...existing, { id: recipeId, meal: mealType, ts: Date.now() }] };
    });
    showToast('Added to calendar ✓');
  }, [showToast]);

  const removeFromCalendar = useCallback((dateKey, recipeId) => {
    setCalendar(cal => {
      const updated = (cal[dateKey] || []).filter(m => m.id !== recipeId);
      const next = { ...cal };
      if (updated.length === 0) delete next[dateKey];
      else next[dateKey] = updated;
      return next;
    });
  }, []);

  const openNewRecipe = useCallback(() => {
    setEditRecipe(blankRecipe());
    navigate('edit');
  }, [navigate]);

  // ── SHARED PROPS ────────────────────────────────────────────────────────────
  const showIndex = INDEX_PAGES.includes(page);

  const breadcrumbs = {
    home: 'Home', saved: 'Saved Recipes', favorites: 'Favourites',
    calendar: 'Meal Calendar', upload: 'Detect Recipe',
    detail: 'Recipe Detail',
    edit: editRecipe?.id?.startsWith('new_') ? 'New Recipe' : 'Edit Recipe',
    settings: 'Settings',
  };

  const viewProps = {
    recipes,
    calendar,
    settings,
    detailId,
    editRecipe,
    calDate,
    setCalDate,
    navigate,
    toggleFav,
    saveRecipe,
    deleteRecipe,
    addToCalendar,
    removeFromCalendar,
    setSettings,
    showToast,
    openCalModal: (recipeId) => setModal({ type: 'cal', recipeId }),
    openDayModal: (dateKey) => setModal({ type: 'day', dateKey }),
  };

  return (
    <>
      <Sidebar page={page} navigate={navigate} />

      <IndexPanel
        show={showIndex}
        recipes={recipes}
        detailId={detailId}
        page={page}
        onSelect={(id) => navigate('detail', { detailId: id })}
        onToggleFav={toggleFav}
        onAdd={openNewRecipe}
      />

      <div className={`main-area${showIndex ? '' : ' expanded'}`}>
        <Topbar
          breadcrumb={breadcrumbs[page] || page}
          onDetect={() => navigate('upload')}
          onNew={openNewRecipe}
        />
        <div className="content-area">
          {page === 'home'      && <HomeView     {...viewProps} />}
          {page === 'saved'     && <SavedView    {...viewProps} />}
          {page === 'favorites' && <SavedView    {...viewProps} favOnly />}
          {page === 'detail'    && <DetailView   {...viewProps} />}
          {page === 'edit'      && <EditView     {...viewProps} />}
          {page === 'upload'    && <UploadView   {...viewProps} />}
          {page === 'calendar'  && <CalendarView {...viewProps} />}
          {page === 'settings'  && <SettingsView {...viewProps} />}
        </div>
      </div>

      {modal && (
        <Modal
          modal={modal}
          recipes={recipes}
          calendar={calendar}
          onClose={() => setModal(null)}
          onAddToCalendar={addToCalendar}
          onRemoveFromCalendar={removeFromCalendar}
          onOpenDetail={(id) => { navigate('detail', { detailId: id }); setModal(null); }}
        />
      )}

      <Toast message={toast} />
    </>
  );
}
