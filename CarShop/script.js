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
    model: "(3 Series G28",
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

function addNewCar(make, model, price, image) {
  const newCar = {
    id: String(cars.length + 1),
    make: make,
    model: model,
    price: price,
    image: image,
  };

  cars.push(newCar);

  const carList = $("#car-list");

  const newCarItem = `
    <li>
      <img src="${newCar.image}" alt="Car image" class="car-image">
      <div class="car-info">
        <h3>${newCar.make} ${newCar.model}</h3>
        <p>Price: $${newCar.price}</p>
        <button class="add-to-cart" data-id="${newCar.id}">Add to Cart</button>
      </div>
    </li>
  `;

  carList.append(newCarItem);
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

    addNewCar(make, model, price, image);

    $("#make-input").val("");
    $("#model-input").val("");
    $("#price-input").val("");
    $("#image-input").val("");
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
}

displayAllCars();

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

$("#make-filter, #price-filter-min, #price-filter-max").on(
  "change",
  applyFilters
);

applyFilters();

function updateCart() {
  var total = 0;
  $('#cart-list').empty();

  $('#car-list li').each(function() {
    var carId = $(this).find('.add-to-cart').data('id');
    var car = cars.find(function(car) {
      return car.id === carId;
    });

    if (car) {
      var carPrice = car.price;
      total += carPrice;

      var cartItem = `
        <li>
          ${car.make} ${car.model} - $${carPrice}
          <button class="remove-from-cart" data-id="${car.id}">Remove</button>
        </li>
      `;
      $('#cart-list').append(cartItem);

      $(this).remove();
    }
  });

  $('#total').text('Total: $' + total);
}


$("#checkout").on("click", function () {
  var cartItems = $("#cart-list li");
  if (cartItems.length === 0) {
    alert("Your shopping cart is empty. Please add items before checkout.");
  } else {
    $("#checkout").hide();
    $("#sale").show();
    cartItems.remove();
    $("#total").text("Total: $0");
  }
});

$("#sale").on("click", function() {
  $(this).hide();

  $('#cart-list li').each(function() {
    var carId = $(this).find('.remove-from-cart').data('id');
    $('#car-list li').each(function() {
      if ($(this).find('.add-to-cart').data('id') === carId) {
        $(this).remove();
      }
    });
  });

  $('#cart-list').empty();

  $('#total').text('Total: $0');
});