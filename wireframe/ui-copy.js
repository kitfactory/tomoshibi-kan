function tUi(id) {
  return (UI_TEXT[locale] && UI_TEXT[locale][id]) || (UI_TEXT.ja && UI_TEXT.ja[id]) || id;
}

function tDyn(key) {
  return (DYNAMIC_TEXT[locale] && DYNAMIC_TEXT[locale][key])
    || (DYNAMIC_TEXT.ja && DYNAMIC_TEXT.ja[key])
    || (DYNAMIC_TEXT.en && DYNAMIC_TEXT.en[key])
    || key;
}
