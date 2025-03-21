import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, addProduct, deleteProduct, updateProduct } from "./features/productsSlice";
import { setCategory } from "./features/filterSlice"; // Импортируем фильтр

function App() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const category = useSelector((state) => state.filter.category); // Берем текущую категорию из Redux
  const [newProductName, setNewProductName] = useState(""); // Поле для названия
  const [newProductPrice, setNewProductPrice] = useState(""); // Поле для цены
  const [newProductCategories, setNewProductCategories] = useState(""); // Поле для категорий
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts()); // Загружаем товары при запуске
  }, [dispatch]);

  // Функция добавления товара
  const handleAddProduct = () => {
    if (!newProductName.trim() || !newProductPrice.trim() || !newProductCategories.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    // Проверяем, что цена — это число
    if (isNaN(newProductPrice)) {
      alert("Цена должна быть числом");
      return;
    }

    // Разделяем категории по запятой и убираем лишние пробелы
    const categories = newProductCategories.split(",").map((cat) => cat.trim());

    const newProduct = {
      id: Date.now().toString(),
      name: newProductName,
      price: Number(newProductPrice),
      categories, // Массив категорий
    };

    dispatch(addProduct(newProduct));
    setNewProductName(""); // Очищаем поля
    setNewProductPrice("");
    setNewProductCategories("");
  };

  // Функция удаления товара
  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  // Функция начала редактирования
  const handleEditClick = (product) => {
    setEditProduct(product);
  };

  // Функция сохранения изменений
  const handleSaveEdit = () => {
    if (editProduct) {
      dispatch(updateProduct(editProduct));
      setEditProduct(null);
    }
  };

  // Фильтрация товаров по категории
  const filteredProducts =
    category === "Все"
      ? products
      : products.filter((product) => product.categories.includes(category));

  return (
    <div>
      <h1>Список товаров</h1>

      {/* Фильтр категорий */}
      <select value={category} onChange={(e) => dispatch(setCategory(e.target.value))}>
        <option value="Все">Все</option>
        <option value="Ноутбуки">Ноутбуки</option>
        <option value="Смартфоны">Смартфоны</option>
        <option value="Аксессуары">Аксессуары</option>
      </select>

      {/* Форма редактирования товара */}
      {editProduct && (
        <div>
          <h3>Редактирование товара</h3>
          <input
            type="text"
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
          <input
            type="number"
            value={editProduct.price}
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: Number(e.target.value) })
            }
          />
          <input
            type="text"
            value={editProduct.categories.join(", ")} // Категории через запятую
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                categories: e.target.value.split(",").map((cat) => cat.trim()),
              })
            }
          />
          <button onClick={handleSaveEdit}>Сохранить</button>
          <button onClick={() => setEditProduct(null)}>Отмена</button>
        </div>
      )}

      {/* Форма для добавления товара */}
      <div>
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Название товара"
        />
        <input
          type="text"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          placeholder="Цена товара"
        />
        <input
          type="text"
          value={newProductCategories}
          onChange={(e) => setNewProductCategories(e.target.value)}
          placeholder="Категории (через запятую)"
        />
        <button onClick={handleAddProduct}>Добавить</button>
      </div>

      {/* Статусы загрузки */}
      {status === "loading" && <p>Загрузка товаров...</p>}
      {status === "failed" && <p>Ошибка: {error}</p>}

      {/* Список товаров */}
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} ₽ - Категории: {product.categories.join(", ")}
            <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
            <button onClick={() => handleEditClick(product)}>Редактировать</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;