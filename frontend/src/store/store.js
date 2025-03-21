import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/productsSlice";
import filterReducer from "../features/filterSlice"; // Добавляем фильтр


export const store = configureStore({
  reducer: {
    products: productsReducer,
    filter: filterReducer, // Подключаем фильтр
  },
});