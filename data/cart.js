export const cart = [];
export function addToCart(productId,productName){
  let matchingItem;

  cart.forEach((item) => {
    if(productId === item.productId){
      matchingItem = item;
    }
  });

  if(matchingItem){
    matchingItem.quantity += 1;
  }
  else{
    cart.push({
      productId: productId,
      productName: productName,
      quantity: 1
    });
  }
}