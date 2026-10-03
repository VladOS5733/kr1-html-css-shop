document.addEventListener('DOMContentLoaded', () => {
  const products = document.querySelectorAll('.product-card');
  const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
  const priceFromInput = document.getElementById('price-from');
  const priceToInput = document.getElementById('price-to');
  const filtersForm = document.getElementById('filters-form');

  function parsePrice(text) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  function filterProducts() {
    // Проверяем, выбран ли «Все товары»
    const allChecked = Array.from(categoryCheckboxes).find(
      cb => cb.checked && cb.value === 'all'
    );

    // Если «Все товары» выбран — сбрасываем остальные категории
    if (allChecked) {
      categoryCheckboxes.forEach(cb => {
        if (cb.value !== 'all') cb.checked = false;
      });
    }

    // Определяем выбранную категорию (кроме «Все товары»)
    const selectedCategory = Array.from(categoryCheckboxes).find(
      cb => cb.checked && cb.value !== 'all'
    );

    const minPrice = priceFromInput.value ? parseInt(priceFromInput.value, 10) : 0;
    const maxPrice = priceToInput.value ? parseInt(priceToInput.value, 10) : Infinity;

    products.forEach(product => {
      const priceText = product.querySelector('.product-card__price')?.textContent.trim();
      const price = parsePrice(priceText);

      // Проверка категории
      let categoryMatch = true;
      if (selectedCategory) {
        if (selectedCategory.value === 'popular') {
          categoryMatch = product.classList.contains('product-card--featured');
        } else if (selectedCategory.value === 'new') {
          categoryMatch = product.classList.contains('product-card--new');
        }
      }

      // Проверка цены
      const priceMatch = price >= minPrice && price <= maxPrice;

      // Показываем или скрываем
      if (categoryMatch && priceMatch) {
        product.style.display = '';
      } else {
        product.style.display = 'none';
      }
    });
  }

  // Запрещаем форме перезагружать страницу
  if (filtersForm) {
    filtersForm.addEventListener('submit', (event) => {
      event.preventDefault();
      filterProducts();
    });
  }

  // Мгновенный фильтр при изменении чекбоксов
  categoryCheckboxes.forEach(cb => {
    cb.addEventListener('change', filterProducts);
  });

  // Мгновенный фильтр при вводе цены
  [priceFromInput, priceToInput].forEach(input => {
    if (input) {
      input.addEventListener('input', filterProducts);
    }
  });
});