var carList = [
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
    model: "3Series (G28)",
    price: 42000,
    image: "photos/BMW 3 series.jpeg",
  },
  {
    id: "3",
    make: "Volkswagen",
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

// Function to add a new car to the list
function addCar(make, model, price, image) {
  var newCar = {
    id: String(carList.length + 1),
    make: make,
    model: model,
    price: price,
    image: image,
  };
  carList.push(newCar);
}

// Form submission event handler
$("#car-form").on("submit", function (event) {
  event.preventDefault();
  var make = $("#make-input").val();
  var model = $("#model-input").val();
  var price = parseInt($("#price-input").val());
  var imageFile = $("#image-input")[0].files[0];
  var image = "path/to/default-image.jpg"; // Default image in case no file is selected

  if (imageFile) {
    var reader = new FileReader();
    reader.onload = function (event) {
      image = event.target.result;
      addCar(make, model, price, image);
      renderCars(carList);
      $("#car-form")[0].reset();
    };

    reader.readAsDataURL(imageFile);
  } else {
    addCar(make, model, price, image);
    renderCars(carList);
    $("#car-form")[0].reset();
  }
});

// Function to render the car list in the UI
function renderCars(carList) {
  var carListContainer = $("#car-list");
  carListContainer.empty();

  carList.forEach(function (car) {
    carListContainer.append(
      `<li data-id="${car.id}">
        <div class="car-item">
          <img class="car-image" src="${car.image}" alt="${car.make} ${
        car.model
      }">
          <div class="car-info">
            <span class="make">${car.make}</span>
            <span class="model">${car.model}</span>
            <span class="price">Price: $${car.price.toLocaleString()}</span>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </li>`
    );
  });
}

// Function to filter cars based on user input
function filterCars() {
  var make = $("#make-filter").val().toLowerCase().replace(/ /g, "-");
  var minPrice = parseInt($("#price-filter-min").val()) || 0;
  var maxPrice = parseInt($("#price-filter-max").val()) || Infinity;

  $("#car-list li").each(function () {
    var carMake = $(this).find(".make").text().toLowerCase().replace(/ /g, "-");
    var carPrice = parseInt($(this).find(".price").text().replace("Price: $", "").replace(/,/g, ""));

    if (
      (make === "all" || carMake === make) &&
      carPrice >= minPrice &&
      carPrice <= maxPrice
    ) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}


// Function to update the shopping cart
function updateCart() {
  var total = 0;
  $("#cart-list").empty();

  $("#car-list li.selected").each(function () {
    var make = $(this).find(".make").text();
    var model = $(this).find(".model").text();
    var price = parseInt(
      $(this).find(".price").text().replace("Price: $", "").replace(/,/g, "")
    );

    total += price;

    $("#cart-list").append(
      `<li data-id="${$(this).data("id")}">
        <span class="make">${make}</span>
        <span class="model">${model}</span>
        <span class="price">Price: $${price.toLocaleString()}</span>
        <button class="remove-from-cart">Remove</button>
      </li>`
    );
  });

  $("#total").text("Total: $" + total.toLocaleString());
}

// Document ready event
$(document).ready(function () {
  renderCars(carList);

  // Event handlers for filtering and interacting with the car list
  $("#make-filter, #price-filter-min, #price-filter-max").change(function () {
    filterCars();
  });

  $('#car-list').on('click', 'li', function () {
    $(this).toggleClass('selected');
  });
  
  $('#car-list').on('click', '.add-to-cart', function () {
    var car = $(this).parent();
    car.toggleClass('selected');
    updateCart();
  });

  $("#cart-list").on("click", ".remove-from-cart", function () {
    var car = $(this).parent();
    var carId = car.data("id");
    $('#car-list li[data-id="' + carId + '"]').removeClass("selected");
    car.remove();
    updateCart();
  });

  // Checkout and sale event handlers
  $("#checkout").on("click", function () {
    var cartItems = $("#cart-list li");
    if (cartItems.length === 0) {
      alert("Your shopping cart is empty. Please add items before checkout.");
    } else {
      $("#sale").show();
      $(".add-to-cart").prop("disabled", true);
    }
  });

  $("#sale").on("click", function () {
    $(this).hide();

    // Remove selected items from the car list
    var selectedCarIds = $("#cart-list li")
      .map(function () {
        return $(this).data("id");
      })
      .get();
    carList = carList.filter(function (car) {
      return !selectedCarIds.includes(car.id);
    });

    renderCars(carList);
    updateCart();
  });
});
