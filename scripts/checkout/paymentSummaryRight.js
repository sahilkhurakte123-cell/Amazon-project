import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOptions } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary(){
  let totalPriceCents = 0;
  let totalShippingCosts = 0;

  cart.forEach((cartitem) => {

    const product = getProduct(cartitem.productId);

    totalPriceCents += product.priceInCents * cartitem.quantity;
    
    const deliveryItem = getDeliveryOptions(cartitem.deliveryOptionId);

    totalShippingCosts += deliveryItem.priceCents;
  });

  const totalBeforeTax = (totalPriceCents + totalShippingCosts);
  const tax = Math.round(totalBeforeTax * 0.1);

  const totalAfterTax = (totalBeforeTax + tax);

  const paymentSummaryHTML = 
  `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(totalPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(totalShippingCosts)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(tax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalAfterTax)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  
};

