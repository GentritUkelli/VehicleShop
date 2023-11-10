const cars = [
  {
    id: "1",
    make: "Mercedes Benz",
    model: "C-Class (W205:2015)",
    price: 45000,
    image: "photos/C-class.jpg",
  },
  {
    id: "2",
    make: "BMW",
    model: "3 Series (G28)",
    price: 42000,
    image: "photos/BMW 3 series.jpeg",
  },
  {
    id: "3",
    make: "Volkswagen (VW)",
    model: "Golf 8",
    price: 28000,
    image: "photos/VW Golf 8.jpg",
  },
  {
    id: "4",
    make: "Ford",
    model: "Fusion",
    price: 32000,
    image: "photos/Ford Fusion.jpg",
  },
  {
    id: "5",
    make: "Toyota",
    model: "Camry",
    price: 35000,
    image: "photos/Toyota Camry.png",
  },
  {
    id: "6",
    make: "Tesla",
    model: "Model 3",
    price: 52000,
    image: "photos/Tesla Model 3.jpg",
  },
  {
    id: "7",
    make: "Nissan",
    model: "Leaf",
    price: 29000,
    image: "photos/Nissan Leaf.jpg",
  },
  {
    id: "8",
    make: "Audi",
    model: "A4",
    price: 47000,
    image: "photos/Audi-A4.jpg",
  },
  {
    id: "9",
    make: "Mercedes Benz",
    model: "E-Class",
    price: 55000,
    image: "photos/Mercedes E-Class.jpg",
  },
  {
    id: "10",
    make: "Chevrolet",
    model: "Bolt",
    price: 32000,
    image: "photos/Chevrolet-Bolt.jpg",
  },
  {
    id: "11",
    make: "BMW",
    model: "i3",
    price: 49000,
    image: "photos/BMW i3.jpg",
  },
];
const cart = [];

function addCar(make, model, price, image) {
  const newCar = {
    id: (cars.length + 1).toString(),
    make: make,
    model: model,
    price: price,
    image: image,
  };
  cars.push(newCar);
}

$("#car-form").submit(function (event) {
  event.preventDefault();

  const make = $("#make-input").val();
  const model = $("#model-input").val();
  const price = parseFloat($("#price-input").val());
  const imageInput = $("#image-input")[0].files[0];

  const reader = new FileReader();

  reader.onload = function () {
    const image = reader.result;

    addCar(make, model, price, image);

    $("#make-input").val("");
    $("#model-input").val("");
    $("#price-input").val("");
    $("#image-input").val("");

    displayAllCars();
  };

  reader.readAsDataURL(imageInput);
});

function displayAllCars() {
  const carList = $("#car-list");

  carList.empty();

  cars.forEach(function (car) {
    const carItem = `
      <li>
        <img src="${car.image}" alt="Car image" class="car-image">
        <div class="car-info">
          <h3>${car.make} ${car.model}</h3>
          <p>Price: $${car.price}</p>
          <button class="add-to-cart" data-id="${car.id}">Add to Cart</button>
        </div>
      </li>
    `;

    carList.append(carItem);
  });

  // Event listener for adding a car to the cart
  $("#car-list").on("click", ".add-to-cart", function () {
    const carId = $(this).data("id");
    addToCart(carId);
  });
}

function applyFilters() {
  const selectedMake = $("#make-filter").val();
  const minPrice = parseFloat($("#price-filter-min").val()) || 0;
  const maxPrice = parseFloat($("#price-filter-max").val()) || Number.MAX_VALUE;

  const filteredCars = cars.filter(function (car) {
    return (
      (selectedMake === "all" || car.make === selectedMake) &&
      car.price >= minPrice &&
      car.price <= maxPrice
    );
  });

  displayFilteredCars(filteredCars);
}

$("#make-filter, #price-filter-min, #price-filter-max").on("change", applyFilters);

applyFilters();

function displayFilteredCars(filteredCars) {
  const carList = $("#car-list");

  carList.empty();

  if (filteredCars.length === 0) {
    carList.append("<p>No cars match the selected filters.</p>");
  } else {
    filteredCars.forEach(function (car) {
      const carItem = `
        <li>
          <img src="${car.image}" alt="Car image" class="car-image">
          <div class="car-info">
            <h3>${car.make} ${car.model}</h3>
            <p>Price: $${car.price}</p>
            <button class="add-to-cart" data-id="${car.id}">Add to Cart</button>
          </div>
        </li>
      `;
      carList.append(carItem);
    });
  }
}

function updateShoppingCart() {
  const total = cart.reduce((acc, car) => acc + car.price, 0);

  const cartList = $("#cart-list");

  cartList.empty();

  cart.forEach(function (car) {
    const cartItem = `
      <li data-id="${car.id}">
        <img src="${car.image}" alt="Car image" class="cart-image">
        <div class="cart-info">
          <h3>${car.make} ${car.model}</h3>
          <p>Price: $${car.price}</p>
          <button class="remove-from-cart" data-id="${car.id}">Remove</button>
        </div>
      </li>
    `;

    cartList.append(cartItem);
  });

  $("#total").text(`Total: $${total}`);
}

// Event listener for removing a car from the cart
$("#cart-list").on("click", ".remove-from-cart", function () {
  const carId = $(this).data("id");
  removeFromCart(carId);
  updateShoppingCart();
  displayAllCars();
});

$("#sale").on("click", function () {
  const selectedCarIds = cart.map(item => item.id);
  cars = cars.filter(car => !selectedCarIds.includes(car.id));
  cart.length = 0;
  updateShoppingCart();
  displayAllCars();
  $("#sale").hide();
});

function addToCart(carId) {
  const selectedCar = cars.find(car => car.id === carId);

  const isInCart = cart.some(item => item.id === selectedCar.id);

  if (!isInCart) {
    cart.push(selectedCar);
    updateShoppingCart();
  }
}

function removeFromCart(carId) {
  const selectedCar = cart.find(item => item.id === carId);
  const carIndex = cart.indexOf(selectedCar);

  if (carIndex !== -1) {
    cart.splice(carIndex, 1);
    updateShoppingCart();
    // displayAllCars(); // No need to update the entire car list when removing from the cart
  }
}

$("#checkout").on("click", function () {
  if (cart.length > 0) {
    $("#sale").show();
    $("#checkout").hide();
  } else {
    alert("Your shopping cart is empty. Please add items before checkout.");
  }
});

displayAllCars();