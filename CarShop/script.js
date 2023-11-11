$(document).ready(function () {
  let  cars = [
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
 
  function addCar(make, model, price, image) {
      const newCar = {
        id: (cars.length + 1).toString(),
        make: make,
        model: model,
        price: price,
        image: image,
      };
  
      cars.push(newCar);
      displayAllCars();
    }
  
    $('#car-form').submit(function (event) {
      event.preventDefault();
  
      var make = $('#make-input').val();
      var model = $('#model-input').val();
      var price = $('#price-input').val();
      var imageInput = $('#image-input')[0];
  
      if (!make || !model || !price || !imageInput.files[0]) {
        alert('Please fill in all fields.');
        return;
      }
  
      var imageFile = imageInput.files[0];
      var reader = new FileReader();
  
      reader.onload = function (e) {
        var image = e.target.result;
        addCar(make, model, price, image);
        $('#car-form')[0].reset();
      };
  
      reader.readAsDataURL(imageFile);
    });
  
    function displayAllCars() {
      displayCars(cars);
      attachEventListeners();
    }
  
    function displayCars(carsToDisplay) {
      const  carList = $('#car-list');
      carList.empty();
  
      carsToDisplay.forEach(function (car) {
        const carItem = `
      <li class="car-item" data-id="${car.id}">
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
  
      carList.find('li').click(function () {
        $(this).toggleClass('selected');
      });
    }
  
    function updateCartDisplay() {
      var cartList = $('#cart-list');
      cartList.empty();
    
      var total = 0;
    
      cars.forEach(function (car, index) {
        var cartItem = cartList.find(`[data-id="${car.id}"]`);
        var quantity = 0;
    
        if (cartItem.length > 0) {
          quantity = parseInt(cartItem.find('.quantity').text()) || 1;
          cartItem.find('.quantity').text(quantity);
        } else {
          quantity = 1;
          cartItem = createCartItem(car);
          cartList.append(cartItem);
        }
    
        // Update individual car price
        var individualCarPrice = car.price * quantity;
        cars[index].price = individualCarPrice; // Assuming 'cars' is a global array
    
        // Update total price
        total += individualCarPrice;
      });
    
      $('#total').text(`Total: $${total.toFixed(2)}`);
    }
    
    
    function createCartItem(car) {
      var listItem = $(`<li data-id="${car.id}">`);
      listItem.append(`<p>${car.make} ${car.model}</p>`);
      listItem.append(`<p class="car-price">$${car.price}</p>`);
      listItem.append('<p class="quantity">1</p>');
      listItem.append(`<button class="remove-from-cart" data-id="${car.id}">Remove</button>`);
      return listItem;
    }
    
    
    function attachEventListeners() {
      $('#car-list').on('click', '.add-to-cart', function () {
        var carId = $(this).data('id');
        var selectedCar = cars.find(function (car) {
          return car.id === carId;
        });
  
        updateCartDisplay();
      });
  
      $('#cart-list').on('click', '.remove-from-cart', function () {
        var carId = $(this).data('id');
        $('[data-id="' + carId + '"]').remove();
        updateCartDisplay();
      });
  
      $('#make-filter, #price-filter-min, #price-filter-max').change(function () {
        var makeFilter = $('#make-filter').val();
        var minPrice = $('#price-filter-min').val();
        var maxPrice = $('#price-filter-max').val();
        filterCars(makeFilter, minPrice, maxPrice);
      });
    }
  
    $('#checkout').click(function () {
      $('#sale').show();
      $('.add-to-cart').prop('disabled', true);
    });
  
    $('#sale').click(function () {
      $(this).hide();
  
      var selectedCarIds = [];
      $('#cart-list li').each(function () {
        var carId = $(this).data('id');
        selectedCarIds.push(carId);
      });
  
      cars = cars.filter(function (car) {
        return !selectedCarIds.includes(car.id);
      });
  
      displayAllCars();
      updateCartDisplay();
    });
  
    function filterCars(makeFilter, minPrice, maxPrice) {
      var filteredCars = cars.filter(function (car) {
        return (
          (makeFilter === 'all' || car.make === makeFilter) &&
          (!minPrice || car.price >= minPrice) &&
          (!maxPrice || car.price <= maxPrice)
        );
      });
  
      displayCars(filteredCars);
    }
  
    displayAllCars();
  });
  