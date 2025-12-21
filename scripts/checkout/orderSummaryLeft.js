import {cart,deleteItem,updateDeliveryOpt} from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOpt} from '../../data/deliveryOptions.js';

export function renderOrderSummary(){

  let cartSummaryHtml = "";
  
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if(product.id === productId){
      matchingProduct = product;
    }
  })

  const deliveryOptionId = cartItem.deliveryOptionId;

  let delOpt;
  
  deliveryOpt.forEach((option) => {
    if(deliveryOptionId === option.id){
      delOpt = option;
    }
  })
  
  const today = dayjs();
  const deliveryDate = today.add(
    delOpt.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  ) 

cartSummaryHtml += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceInCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id = "${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options js-delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptHTML(matchingProduct,cartItem)}
      </div>
    </div>
  </div>
  `
});

function deliveryOptHTML(matchingProduct,cartItem){
  let html = '';
  deliveryOpt.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    ) 

    const priceString = 
          deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - `;
    
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html +=`
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" 
          ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>`

  });
  return html;
};

document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;

document.querySelectorAll('.js-delete-quantity').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    deleteItem(productId);

    document.querySelector(`.js-cart-item-container-${productId}`).remove();
    
  })
});

document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', () => {
    const {productId,deliveryOptionId} = element.dataset;  
    updateDeliveryOpt(productId,deliveryOptionId);
    renderOrderSummary();
  })
})

};

renderOrderSummary();